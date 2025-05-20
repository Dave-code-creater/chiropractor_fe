import { CheckIcon } from '@heroicons/react/20/solid'
import services from '../../../constants/services'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Services() {
    const navigate = useNavigate()
    const user = false

    const handleBookAppointment = (serviceId) => {
        if (user) {
            navigate(`/services/${user.id}/booking/${serviceId}`)
        } else {
            navigate('/login')
        }
    }
    return (
        <section className="relative isolate bg-gradient-to-br from-white via-gray-50 to-indigo-50 px-6 pb-20 pt-16 sm:pb-24 sm:pt-20 lg:px-8">
            {/* Soft radial background blob */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] aspect-[3/1] bg-indigo-100 opacity-30 rounded-full blur-3xl" />
            </div>

            {/* Section header */}
            <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Choose Your Care
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    At <span className="font-semibold text-indigo-600">Dr. Dieu Phan D.C.</span>, your health and satisfaction come first. Our services are tailored to meet your unique needs.
                </p>
                <p className="mt-3 text-base text-gray-500">
                    Whether you're recovering, maintaining, or optimizing — we're here to guide you every step of the way.
                </p>
            </div>

            {/* Service cards */}
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-10 gap-x-12 sm:grid-cols-2 lg:max-w-5xl">
                {services.map((tier) => (
                    <div
                        key={tier.id}
                        className={classNames(
                            'rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition duration-300 ease-in-out',
                            tier.featured && 'ring-2 ring-indigo-500'
                        )}
                    >
                        <h3 className={classNames('text-lg font-semibold', tier.featured ? 'text-indigo-600' : 'text-gray-900')}>
                            {tier.name}
                        </h3>
                        <p className="mt-4 text-sm text-gray-600">{tier.description}</p>

                        <ul className="mt-6 space-y-2 text-sm text-gray-700">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-x-2">
                                    <CheckIcon className="h-5 w-5 text-indigo-500 mt-0.5" aria-hidden="true" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleBookAppointment(tier.id)}
                            className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Get started today
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}