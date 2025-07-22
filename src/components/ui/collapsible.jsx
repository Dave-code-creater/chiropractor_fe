import * as React from "react"
import { cn } from "@/lib/utils"

const CollapsibleContext = React.createContext()

const Collapsible = ({ children, open, onOpenChange, className, ...props }) => {
    const [isOpen, setIsOpen] = React.useState(open || false)

    React.useEffect(() => {
        if (open !== undefined) {
            setIsOpen(open)
        }
    }, [open])

    const toggle = React.useCallback(() => {
        const newState = !isOpen
        setIsOpen(newState)
        onOpenChange?.(newState)
    }, [isOpen, onOpenChange])

    return (
        <CollapsibleContext.Provider value={{ isOpen, toggle }}>
            <div className={cn("", className)} {...props}>
                {children}
            </div>
        </CollapsibleContext.Provider>
    )
}

const CollapsibleTrigger = React.forwardRef(({ children, asChild, onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)

    if (!context) {
        throw new Error('CollapsibleTrigger must be used within a Collapsible')
    }

    const handleClick = (e) => {
        context.toggle()
        onClick?.(e)
    }

    if (asChild) {
        return React.cloneElement(children, {
            ...props,
            ref,
            onClick: (e) => {
                handleClick(e)
                children.props.onClick?.(e)
            }
        })
    }

    return (
        <button ref={ref} onClick={handleClick} {...props}>
            {children}
        </button>
    )
})

const CollapsibleContent = ({ children, className, ...props }) => {
    const context = React.useContext(CollapsibleContext)

    if (!context) {
        throw new Error('CollapsibleContent must be used within a Collapsible')
    }

    if (!context.isOpen) {
        return null
    }

    return (
        <div
            className={cn("animate-in slide-in-from-top-2 duration-200", className)}
            {...props}
        >
            {children}
        </div>
    )
}

CollapsibleTrigger.displayName = "CollapsibleTrigger"
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
