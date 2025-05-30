const navigationItems = [
  { name: 'Activities', href: '#', current: true },
]

export default function Navigation() {
  return (
    <nav className="bg-yellow-950">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex justify-between relative items-center h-16">
                <div className="flex items-center h-full inset-y-0 left-0">
                    <div className="flex flex-1 justify-center items-stretch mr-6">
                        <img alt="Social Eyes" src="../src/assets/branding/logo.png" className="h-10 w-auto" />
                        <div className="text-xl/10 font-bold ml-2">Social Eyes</div>
                    </div>
                    {navigationItems.map((item) => (
                        <div key={item.name} className={`flex h-full items-center px-4 text-md text-white font-medium ${item.current ? 'border-b-3 border-solid border-yellow-700' : 'hover:bg-slate-700'}`}>{item.name}</div>
                    ))}
                </div>
                <div className="flex items-center">
                    <button className="bg-yellow-800 inline-flex items-center text-sm font-medium rounded-md px-4 py-2 mr-4"><img className="h-4 mr-2" src="../src/assets/icons/plus.svg" />New Activity</button>
                    <div className="rounded-md px-2 py-1">
                        <div className="relative rounded-full p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 focus:outline-hidden">
                            <img src="../src/assets/branding/profile-icon-placeholder.svg" className="size-8 rounded-full" />
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </nav>
  )
}