



function Appearance() {
    return (
        <div className="hidden space-y-6 w-full md:block">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <div className="flex-1 pb-2 lg:max-w-2xl mb-10">
                    <h2 className="text-lg font-bold tracking-tight ">Appearance</h2>
                    <p className="text-muted-foreground text-md size-3xl">
                        Customize your appearance settings.
                    </p>
            
                
        {/* <!-- Seperator --> */}
                    <div className=" rounded-lg divide-y divide-gray-200">
                        <dl className="grid grid-cols-3 gap-4 pb-2 pt-4">
                            {/* Add your appearance settings here */}
                        
                                <h2 className="text-md font-bold tracking-tight">Theme</h2>
                                <p className="text-muted-foreground text-md size-2xl">
                                    Choose your preferred theme.
                                </p>
                                <div className="flex items-center space-x-4 mt-4">
                                    <label className="text-md size-2xl">Light</label>
                                    <input type="radio" name="theme" value="light" />
                                    <label className="text-md size-2xl">Dark</label>
                                    <input type="radio" name="theme" value="dark" />
                                </div>
                                <h2 className="text-md font-bold tracking-tight">Font Size</h2>
                                <p className="text-muted-foreground text-md size-2xl">
                                    Choose your preferred font size.
                                </p>

                                <div className="flex items-center space-x-4 mt-4">
                                    <label className="text-md size-2xl">Small</label>
                                    <input type="radio" name="font-size" value="small" />
                                    <label className="text-md size-2xl">Medium</label>
                                    <input type="radio" name="font-size" value="medium" />
                                    <label className="text-md size-2xl">Large</label>
                                    <input type="radio" name="font-size" value="large" />
                                </div>

                                <h2 className="text-md font-bold tracking-tight">Color Scheme</h2>
                                <p className="text-muted-foreground text-md size-2xl">
                                    Choose your preferred color scheme.
                                </p>

                                <div className="flex items-center space-x-4 mt-4">
                                    <label className="text-md size-2xl">Blue</label>
                                    <input type="radio" name="color-scheme" value="blue" />
                                    <label className="text-md size-2xl">Green</label>
                                    <input type="radio" name="color-scheme" value="green" />
                                    <label className="text-md size-2xl">Red</label>
                                    <input type="radio" name="color-scheme" value="red" />
                                </div>
                               
                                <h2 className="text-md font-bold tracking-tight">Sidebar Position</h2>
                                <p className="text-muted-foreground text-md size-2xl">
                                    Choose your preferred sidebar position.
                                </p>
                                <div className="flex items-center space-x-4 mt-4">
                                    <label className="text-md size-2xl">Left</label>
                                    <input type="radio" name="sidebar-position" value="left" />
                                    <label className="text-md size-2xl">Right</label>
                                    <input type="radio" name="sidebar-position" value="right" />
                                    <label className="text-md size-2xl">Hidden</label>
                                    <input type="radio" name="sidebar-position" value="hidden" />
                                </div>
                                <h2 className="text-md font-bold tracking-tight">Button Style</h2>
                                <p className="text-muted-foreground text-md size-2xl">
                                    Choose your preferred button style.
                                </p>
                                <div className="flex items-center space-x-4 mt-4">
                                    <label className="text-md size-2xl">Rounded</label>
                                    <input type="radio" name="button-style" value="rounded" />
                                    <label className="text-md size-2xl">Square</label>
                                    <input type="radio" name="button-style" value="square" />
                                    <label className="text-md size-2xl">Outline</label>
                                    <input type="radio" name="button-style" value="outline" />
                                </div>


                        </dl>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
export default Appearance