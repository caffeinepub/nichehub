import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import WorkspaceToggle from './components/WorkspaceToggle';
import MediaLibrary from './components/MediaLibrary';
import Calendar from './components/Calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <WorkspaceProvider>
        <Layout>
          <div className="flex flex-col h-full">
            <WorkspaceToggle />
            
            <Tabs defaultValue="library" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="library">Media Library</TabsTrigger>
                <TabsTrigger value="calendar">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="library" className="flex-1 mt-0">
                <MediaLibrary />
              </TabsContent>
              
              <TabsContent value="calendar" className="flex-1 mt-0">
                <Calendar />
              </TabsContent>
            </Tabs>
          </div>
        </Layout>
        <Toaster />
      </WorkspaceProvider>
    </ThemeProvider>
  );
}

export default App;
