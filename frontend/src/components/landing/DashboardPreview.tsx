export default function DashboardPreview() {
  const jobs = [
    {
      company: "Google",
      role: "Senior Product Designer",
      location: "Mt. View, California",
      salary: "$200k - $280k",
      logo: "G",
      logoBg: "bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20",
    },
    {
      company: "Facebook",
      role: "Senior UI/Ux Designer",
      location: "Menlo Park, California",
      salary: "$150k - $170k",
      logo: "f",
      logoBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    },
    {
      company: "Apple",
      role: "Product Designer",
      location: "Cupertino, California",
      salary: "$250k - $320k",
      logo: "",
      logoBg: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-[#333]",
      active: true,
    },
    {
      company: "Spotify",
      role: "Head Of Design",
      location: "Manhattan, New York",
      salary: "$340k - $400k",
      logo: "S",
      logoBg: "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
    },
    {
      company: "Tinder",
      role: "Graphic Designer",
      location: "Dallas, Texas",
      salary: "$120k - $170k",
      logo: "t",
      logoBg: "bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20",
    },
    {
      company: "Dropbox",
      role: "Senior UI Designer",
      location: "Dallas, Texas",
      salary: "$150k - $200k",
      logo: "D",
      logoBg: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20",
    },
  ];

  return (
    <div className="w-full flex items-center justify-center font-sans p-4 md:p-8 bg-transparent">
      
      {/* Mac Window Container */}
      <div className="w-full max-w-[1200px] h-[80vh] min-h-[650px] bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#222] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-colors">
        
        {/* Mac OS Header */}
        <div className="h-12 bg-zinc-100 dark:bg-[#1a1a1c] border-b border-zinc-200 dark:border-[#222] flex items-center px-4 shrink-0 transition-colors">
          <div className="flex gap-2 w-24">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm" />
          </div>
          
          {/* Fake URL / Search Bar */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg h-7 bg-white dark:bg-[#0a0a0b] border border-zinc-200 dark:border-[#333] rounded-md flex items-center px-3 gap-2 shadow-inner transition-colors">
              <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <div className="flex-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <span className="text-zinc-400 dark:text-zinc-600">aspiria.dev/workspace/</span>
                <span className="text-zinc-900 dark:text-zinc-200">search?role=designer&loc=usa</span>
              </div>
              <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </div>
          </div>
          
          <div className="w-24 flex justify-end">
             <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-[#222] border border-zinc-300 dark:border-[#333] flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
               MF
             </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-56 bg-zinc-50 dark:bg-[#111113] border-r border-zinc-200 dark:border-[#222] flex flex-col shrink-0 transition-colors z-10">
            
            <div className="p-4 border-b border-zinc-200 dark:border-[#222]">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-white dark:bg-[#1a1a1c] border border-zinc-200 dark:border-[#333] rounded-md cursor-pointer hover:bg-zinc-50 dark:hover:bg-[#222] transition-colors">
                <div className="w-4 h-4 rounded-sm bg-orange-500 flex items-center justify-center text-[8px] font-bold text-white">
                  A
                </div>
                <span className="text-[11px] font-bold text-zinc-900 dark:text-white tracking-wide">Aspiria Workspace</span>
                <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-3">
              <div className="px-3 space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 px-3 py-2 mb-1">Views</div>
                
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 rounded-md hover:bg-zinc-200/50 dark:hover:bg-[#1a1a1c] hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Dashboard
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-medium bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-md transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Search Jobs
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 rounded-md hover:bg-zinc-200/50 dark:hover:bg-[#1a1a1c] hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  Applications
                </button>
              </div>

              <div className="mt-6 px-3 space-y-0.5">
                <div className="flex items-center justify-between px-3 py-2 mb-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Saved Queries</div>
                  <svg className="w-3 h-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-2 px-3 py-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    role:"Frontend"
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    salary:{">"}150k
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    type:"Remote"
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main List Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-[#0a0a0b] min-w-0 border-r border-zinc-200 dark:border-[#222] transition-colors">
            
            {/* Query Info / Toolbar */}
            <div className="px-5 py-3 border-b border-zinc-200 dark:border-[#222] bg-zinc-50 dark:bg-[#111113] flex flex-col gap-3 transition-colors shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Results</span>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 px-1.5 py-0.5 rounded font-mono">title: "Designer"</span>
                    <span className="text-[10px] bg-zinc-100 dark:bg-[#1a1a1c] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-[#333] px-1.5 py-0.5 rounded font-mono">loc: "USA"</span>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                  284 items • 45ms
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="text-[10px] font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-[#1a1a1c] border border-zinc-200 dark:border-[#333] px-2.5 py-1 rounded shadow-sm flex items-center gap-1 transition-colors hover:bg-zinc-50 dark:hover:bg-[#222]">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  Filter
                </button>
                <button className="text-[10px] font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-[#1a1a1c] border border-zinc-200 dark:border-[#333] px-2.5 py-1 rounded shadow-sm flex items-center gap-1 transition-colors hover:bg-zinc-50 dark:hover:bg-[#222]">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                  Sort: Relevance
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {jobs.map((job, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center px-3 py-2.5 rounded-lg border transition-all cursor-pointer group ${
                    job.active 
                      ? 'bg-zinc-50 dark:bg-[#1a1a1c] border-orange-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(249,115,22,0.05)]' 
                      : 'bg-white dark:bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-[#111113] hover:border-zinc-200 dark:hover:border-[#222]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-[14px] font-bold mr-3 shrink-0 ${job.logoBg}`}>
                    {job.logo}
                  </div>
                  
                  <div className="flex-1 min-w-0 grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5 min-w-0">
                      <h3 className={`text-[12px] font-bold truncate transition-colors ${job.active ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white'}`}>
                        {job.role}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{job.company}</p>
                    </div>
                    
                    <div className="col-span-4 min-w-0 hidden sm:block">
                      <h4 className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{job.location}</h4>
                    </div>
                    
                    <div className="col-span-7 sm:col-span-3 text-right flex items-center justify-end gap-2">
                      <h4 className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300">{job.salary}</h4>
                      {job.active && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Details Panel (Inspector) */}
          <div className="w-[340px] bg-zinc-50 dark:bg-[#111113] flex flex-col shrink-0 transition-colors">
            
            {/* Inspector Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-[#222] px-2 pt-2 gap-1 bg-zinc-100 dark:bg-[#1a1a1c] transition-colors">
              <button className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#222] border-b-transparent px-3 py-1.5 rounded-t-md translate-y-[1px]">Overview</button>
              <button className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 px-3 py-1.5 transition-colors">Requirements</button>
              <button className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 px-3 py-1.5 transition-colors">Company</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              
              {/* Header Info */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-[#333] shadow-sm flex items-center justify-center text-2xl text-zinc-900 dark:text-white shrink-0">
                  
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-zinc-900 dark:text-white leading-tight mb-1">Product Designer</h2>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Apple</span>
                    <span>•</span>
                    <span className="font-mono text-[9px]">ID: AAPL_4829</span>
                  </div>
                </div>
              </div>

              {/* Key Value Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-[#1a1a1c] border border-zinc-200 dark:border-[#333] p-2.5 rounded-md shadow-sm">
                  <div className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold mb-1">Location</div>
                  <div className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 truncate">Cupertino, CA</div>
                </div>
                <div className="bg-white dark:bg-[#1a1a1c] border border-zinc-200 dark:border-[#333] p-2.5 rounded-md shadow-sm">
                  <div className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold mb-1">Salary Range</div>
                  <div className="text-[11px] font-mono font-medium text-zinc-800 dark:text-zinc-200 truncate">$250k - $320k</div>
                </div>
              </div>

              <div className="h-px bg-zinc-200 dark:bg-[#222] my-5" />

              {/* Match Score & Tags */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">Skills Match</div>
                  <div className="text-[10px] font-mono font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded border border-green-200 dark:border-green-500/20">92%</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-medium bg-white dark:bg-[#1a1a1c] border border-zinc-200 dark:border-[#333] px-2 py-1 rounded-md text-zinc-700 dark:text-zinc-300 shadow-sm">Figma</span>
                  <span className="text-[10px] font-medium bg-white dark:bg-[#1a1a1c] border border-zinc-200 dark:border-[#333] px-2 py-1 rounded-md text-zinc-700 dark:text-zinc-300 shadow-sm">Prototyping</span>
                  <span className="text-[10px] font-medium bg-white dark:bg-[#1a1a1c] border border-zinc-200 dark:border-[#333] px-2 py-1 rounded-md text-zinc-700 dark:text-zinc-300 shadow-sm">UX Research</span>
                  <span className="text-[10px] font-medium bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2 py-1 rounded-md text-red-600 dark:text-red-400 shadow-sm line-through opacity-70">SwiftUI</span>
                </div>
              </div>

              <div className="h-px bg-zinc-200 dark:bg-[#222] my-5" />

              {/* Description Snippet */}
              <div>
                 <div className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold mb-2 flex justify-between items-center">
                   <span>Details</span>
                   <button className="text-orange-600 dark:text-orange-400 normal-case tracking-normal hover:underline">View full</button>
                 </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  The Apple Pay Design team is looking for an extraordinary product designer. You are a natural collaborator and an excellent communicator, able to develop and present design ideas...
                </p>
              </div>

            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-zinc-200 dark:border-[#222] bg-white dark:bg-[#1a1a1c] flex gap-2 shrink-0 transition-colors">
              <button className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-[11px] font-bold py-2.5 rounded-md transition-colors shadow-sm flex items-center justify-center gap-2">
                Apply Now
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <button className="w-10 bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#333] border border-zinc-200 dark:border-[#333] text-zinc-500 dark:text-zinc-400 flex items-center justify-center rounded-md transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}