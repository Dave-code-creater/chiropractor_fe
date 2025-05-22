

function Display() {
  return (
    <div className="hidden space-y-6 w-full md:block">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <div className="flex-1 pb-2 lg:max-w-5xl mb-10">    
                <h2 className="text-lg font-bold tracking-tight ">Display</h2>
                <p className="text-muted-foreground text-md size-3xl">
                    Customize your display settings.
                </p>
                {/* Seperator */}
                <div className="rounded-lg divide-y divide-gray-200">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 pt-4">
                            <div>
                                <dt className="font-semibold">Language</dt>
                                <dd className="mt-1">Tiếng Việt / English</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Date format</dt>
                                <dd className="mt-1">DD/MM/YYYY / MM/DD/YYYY</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Time zone</dt>
                                <dd className="mt-1">UTC+7 / System default</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Units</dt>
                                <dd className="mt-1">
                                    <ul className="list-disc ml-5">
                                        <li>Height: cm / ft-in</li>
                                        <li>Weight: kg / lb</li>
                                    </ul>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Calendar view</dt>
                                <dd className="mt-1">List / Grid</dd>
                            </div>

                         </dl>      
                </div>
            </div>
        </div>
    </div>
  );
}
export default Display;