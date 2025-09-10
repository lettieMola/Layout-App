import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, Edit, Search, Upload, Cloud, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Collage } from "@shared/schema";
import DriveIntegration from "@/components/DriveIntegration";

export default function Gallery() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Fetch all collages
  const { data: collages = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/collages'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/collages');
      return await response.json();
    },
  });

  // Delete collage mutation
  const deleteMutation = useMutation({
    mutationFn: async (collageId: string) => {
      await apiRequest('DELETE', `/api/collages/${collageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/collages'] });
      toast({
        title: "Success",
        description: "Collage deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete collage",
        variant: "destructive",
      });
    },
  });

  // Backup to Google Drive mutation
  const backupMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/backup-to-drive');
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Backup Successful",
        description: `${data.count} collages backed up to Google Drive`,
      });
    },
    onError: () => {
      toast({
        title: "Backup Failed",
        description: "Failed to backup to Google Drive",
        variant: "destructive",
      });
    },
  });

  // Auto-backup functionality
  useEffect(() => {
    const autoBackup = async () => {
      if (collages.length > 0) {
        const lastBackup = localStorage.getItem('lastBackupTime');
        const now = Date.now();
        const daysSinceBackup = lastBackup ? (now - parseInt(lastBackup)) / (1000 * 60 * 60 * 24) : 999;
        
        // Auto-backup every 7 days
        if (daysSinceBackup >= 7) {
          console.log('Performing auto-backup to Google Drive...');
          try {
            await backupMutation.mutateAsync();
            localStorage.setItem('lastBackupTime', now.toString());
          } catch (error) {
            console.log('Auto-backup failed:', error);
          }
        }
      }
    };

    autoBackup();
  }, [collages, backupMutation]);

  const filteredCollages = collages.filter((collage: Collage) =>
    collage.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (collageId: string) => {
    setLocation(`/editor?collageId=${collageId}`);
  };

  const handleDelete = (collageId: string) => {
    if (confirm("Are you sure you want to delete this collage?")) {
      deleteMutation.mutate(collageId);
    }
  };

  const handleDownload = async (collage: Collage) => {
    // Create a simple canvas to generate download
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#333';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(collage.name, 200, 200);
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${collage.name}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    });

    toast({
      title: "Download Started",
      description: "Collage download initiated",
    });
  };

  const handleBackupToDrive = async () => {
    try {
      setIsBackingUp(true);
      await backupMutation.mutateAsync();
      localStorage.setItem('lastBackupTime', Date.now().toString());
    } catch (error) {
      console.error('Manual backup failed:', error);
    } finally {
      setIsBackingUp(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageCount = (collage: Collage) => {
    if (Array.isArray(collage.images)) {
      return collage.images.length;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Collages</h1>
            <p className="text-muted-foreground">
              {collages.length} saved collage{collages.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleBackupToDrive}
              variant="outline"
              size="sm"
              disabled={isBackingUp || backupMutation.isPending}
              data-testid="button-backup-drive"
            >
              {isBackingUp || backupMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              {isBackingUp || backupMutation.isPending ? 'Backing up...' : 'Backup to Drive'}
            </Button>
            
            <Button
              onClick={() => setLocation('/editor')}
              data-testid="button-create-new"
            >
              Create New
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search collages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-collages"
          />
        </div>

        {/* Collages Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-muted h-32 rounded mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-3 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCollages.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">No collages found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "Create your first collage to get started"}
                </p>
              </div>
              <Button onClick={() => setLocation('/editor')}>
                Create New Collage
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollages.map((collage: Collage) => (
              <Card key={collage.id} className="hover-elevate cursor-pointer group">
                <CardContent className="p-4">
                  {/* Thumbnail */}
                  <div 
                    className="bg-muted h-32 rounded mb-4 flex items-center justify-center"
                    onClick={() => handleEdit(collage.id)}
                  >
                    <div className="text-muted-foreground text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Collage Preview</p>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 
                        className="font-semibold truncate flex-1 cursor-pointer hover:text-primary"
                        onClick={() => handleEdit(collage.id)}
                        data-testid={`text-collage-name-${collage.id}`}
                      >
                        {collage.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getImageCount(collage)} images
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {collage.createdAt ? formatDate(collage.createdAt) : 'No date'}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(collage.id)}
                        data-testid={`button-edit-${collage.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(collage)}
                        data-testid={`button-download-${collage.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(collage.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${collage.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Google Drive Integration */}
        <DriveIntegration 
          onCollageRestore={(collageData) => {
            console.log('Restored collage from Google Drive:', collageData);
            toast({
              title: "Collage Restored",
              description: "Collage restored from Google Drive",
            });
          }}
        />

        {/* Back to Home */}
        <div className="flex justify-center pt-8">
          <Button variant="outline" onClick={() => setLocation('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}