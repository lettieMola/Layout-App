import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, Edit, Search, Upload, Cloud, RefreshCw, Home as HomeIcon, Heart, User as UserIcon } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Collage } from "@shared/schema";
import DriveIntegration from "@/components/DriveIntegration";
import { toPng } from 'html-to-image';

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
        title: "Deleted",
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

  // Download collage mutation
  const downloadMutation = useMutation({
    mutationFn: async (collageId: string) => {
      const response = await apiRequest('GET', `/api/collages/${collageId}/download`);
      return await response.blob();
    },
    onSuccess: (blob, collageId) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `collage-${collageId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Downloaded",
        description: "Collage downloaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to download collage",
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

  const handleEdit = (collage: Collage) => {
    setLocation(`/editor?collageId=${collage.id}`);
  };

  const handleDelete = (collageId: string) => {
    if (confirm("Are you sure you want to delete this collage?")) {
      deleteMutation.mutate(collageId);
    }
  };

  const handleDownload = (collage: Collage) => {
    downloadMutation.mutate(collage.id);
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
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-2">
          <div>
            <h1 className="text-xl font-bold">My Gallery</h1>
            <p className="text-sm text-muted-foreground">
              {collages.length} collage{collages.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="ghost"
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
            </Button>

            <Button
              onClick={() => setLocation('/editor')}
              size="sm"
              data-testid="button-create-new"
            >
              <Edit className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your collages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
            data-testid="input-search-collages"
          />
        </div>

        {/* Collages Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted animate-pulse rounded"></div>
                  <div className="p-3 space-y-2">
                    <div className="bg-muted h-3 rounded animate-pulse"></div>
                    <div className="bg-muted h-2 rounded animate-pulse w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCollages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-semibold">No collages yet</h3>
              <p className="text-muted-foreground max-w-sm">
                {searchQuery ? "Try a different search term" : "Create your first collage to get started"}
              </p>
            </div>
            <Button onClick={() => setLocation('/editor')} className="rounded-full">
              <Edit className="w-4 h-4 mr-2" />
              Create Your First Collage
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
            {filteredCollages.map((collage: Collage) => (
              <Card key={collage.id} className="hover-elevate cursor-pointer group border-0 shadow-none">
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div
                    className="aspect-square bg-muted flex items-center justify-center overflow-hidden cursor-pointer relative"
                    onClick={() => handleEdit(collage)}
                  >
                    {collage.preview ? (
                      <img src={collage.preview} alt={collage.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-muted-foreground text-center p-4">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs">Collage Preview</p>
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(collage);
                        }}
                        data-testid={`button-edit-${collage.id}`}
                        className="rounded-full"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(collage);
                        }}
                        data-testid={`button-download-${collage.id}`}
                        className="rounded-full"
                      >
                        <Download className="w-3 h-3" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(collage.id);
                        }}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${collage.id}`}
                        className="rounded-full"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-1">
                    <h3
                      className="font-medium text-sm truncate cursor-pointer hover:text-primary"
                      onClick={() => handleEdit(collage)}
                      data-testid={`text-collage-name-${collage.id}`}
                    >
                      {collage.name}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {getImageCount(collage)} images
                      </Badge>
                      <span>
                        {collage.createdAt ? formatDate(collage.createdAt) : 'No date'}
                      </span>
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

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
          <div className="flex justify-around items-center py-2 max-w-md mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col gap-1 h-auto py-2"
              onClick={() => setLocation('/')}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col gap-1 h-auto py-2"
              onClick={() => setLocation('/explore')}
            >
              <Search className="w-5 h-5" />
              <span className="text-xs">Search</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex flex-col gap-1 h-auto py-2 rounded-full border-2 border-primary"
              onClick={() => setLocation('/editor')}
            >
              <Edit className="w-5 h-5" />
              <span className="text-xs">Create</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col gap-1 h-auto py-2"
              onClick={() => setLocation('/mirror')}
            >
              <Heart className="w-5 h-5" />
              <span className="text-xs">Activity</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex flex-col gap-1 h-auto py-2"
              onClick={() => {}}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}