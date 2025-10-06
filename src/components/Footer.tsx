import { Github } from 'lucide-react';

export default function Footer() {
   return (
      <footer className="border-t">
         <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
               <div className="flex items-center gap-1">© Handong Software Foundation</div>

               <div className="flex items-center gap-6">
                  <span>Developed by 한시온, 오인혁, 김용현</span>
                  <a
                     href="https://github.com/HandongSF"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                     <Github className="w-4 h-4" />
                     GitHub
                  </a>
               </div>
            </div>
         </div>
      </footer>
   );
}
