export function DemoContainer({ children }: { children: React.ReactNode }) {
   return (
      <div className="relative border border-accent/30 flex flex-col items-center justify-center my-10 p-4 rounded-md">
         <span className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-2 py-1 rounded-bl-md rounded-tr-md">
            DEMO
         </span>
         {children}
      </div>
   );
}
