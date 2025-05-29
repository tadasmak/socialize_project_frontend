const navigationItems = [
  { name: 'Activities', href: '#', current: true },
  { name: 'Profile', href: '#', current: false }
]

export default function Navigation() {
  return (
    <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center">
                    {navigationItems.map((item) => (
                        <div key={item.name} className={`text-white px-3 py-2 rounded-md text-sm font-medium ${item.current ? 'bg-gray-900' : 'hover:bg-gray-700'}`}>{item.name}</div>
                    ))}
                </div>
            </div>
        </div>
    </nav>
  )
}