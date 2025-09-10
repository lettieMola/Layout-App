import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Download, Upload, RefreshCw, Trash2, CheckCircle } from "lucide-react";
import { driveService, DriveFileInfo } from "@/lib/googleDrive";
import { useToast } from "@/hooks/use-toast";

interface DriveIntegrationProps {
  onCollageRestore?: (collageData: any) => void;
  className?: string;
}

export default function DriveIntegration({ onCollageRestore, className }: DriveIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const success = await driveService.authenticate();
      if (success) {
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Successfully connected to Google Drive",
        });
        await loadDriveFiles();
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Drive",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDriveFiles = async () => {
    try {
      const files = await driveService.listCollages();
      setDriveFiles(files);
    } catch (error) {
      console.error("Failed to load Drive files:", error);
      toast({
        title: "Load Failed",
        description: "Failed to load files from Google Drive",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    setIsLoading(true);
    try {
      const result = await driveService.downloadCollage(fileId);
      if (result.success && onCollageRestore) {
        onCollageRestore(result.data);
        toast({
          title: "Download Complete",
          description: `${fileName} downloaded successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download collage from Google Drive",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}" from Google Drive?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await driveService.deleteCollage(fileId);
      if (success) {
        await loadDriveFiles(); // Refresh the list
        toast({
          title: "Deleted",
          description: `${fileName} deleted from Google Drive`,
        });
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete file from Google Drive",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Google Drive Integration
          {isConnected && <CheckCircle className="w-4 h-4 text-green-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect to Google Drive to backup and sync your collages across devices
            </p>
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
              data-testid="button-connect-drive"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4 mr-2" />
              )}
              Connect to Google Drive
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {driveFiles.length} files in Google Drive
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={loadDriveFiles}
                disabled={isLoading}
                data-testid="button-refresh-drive"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {driveFiles.length === 0 ? (
              <div className="text-center py-8">
                <Cloud className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No collages found in Google Drive
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {driveFiles.map((file) => (
                  <Card key={file.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {file.name.replace('.json', '')}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(file.size)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(file.modifiedTime)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(file.id, file.name)}
                          disabled={isLoading}
                          data-testid={`button-download-drive-${file.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(file.id, file.name)}
                          disabled={isLoading}
                          data-testid={`button-delete-drive-${file.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}