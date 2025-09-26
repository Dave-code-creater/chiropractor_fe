import {
  Settings as AdjustmentsHorizontalIcon,
  Package as CubeIcon,
  Video as FilmIcon,
  Clock as ClockIcon,
  BarChart as ChartBarIcon,
  MessageSquareMore as ChatBubbleLeftRightIcon
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserId, selectIsAuthenticated } from "../../../state/data/authSlice";

const chiropracticServices = [
  {
    id: 1,
    icon: AdjustmentsHorizontalIcon,
    title: "Spinal Manipulation",
    description: "Precise adjustments and manual therapy to restore proper spinal alignment and relieve pain effectively."
  },
  {
    id: 2,
    icon: CubeIcon,
    title: "Joint Mobilization",
    description: "Gentle joint movements and manual techniques to improve mobility and reduce stiffness."
  },
  {
    id: 3,
    icon: FilmIcon,
    title: "Soft Tissue Therapy",
    description: "Targeted muscle and soft tissue treatments to reduce tension and promote healing."
  },
  {
    id: 4,
    icon: ClockIcon,
    title: "Therapeutic Exercise",
    description: "Customized exercise programs designed to strengthen muscles and prevent future injuries."
  },
  {
    id: 5,
    icon: ChartBarIcon,
    title: "Advanced Diagnostics",
    description: "Comprehensive assessments and modern diagnostic tools to identify the root cause of your pain."
  },
  {
    id: 6,
    icon: ChatBubbleLeftRightIcon,
    title: "Lifestyle Counseling",
    description: "Expert guidance on posture, ergonomics, and lifestyle modifications for long-term wellness."
  }
];

export default function Services() {
  const navigate = useNavigate();
  const user = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleBookAppointment = () => {
    if (user && isAuthenticated) {
      navigate(`/services/${user.id}/appointments/tier-chiropractic`);
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative isolate px-6 pb-20 pt-16 sm:pb-24 sm:pt-20 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] aspect-[3/1] bg-earthfire-clay-100 opacity-30 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Care
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            At{" "}
            <span className="font-semibold text-indigo-600">
              Dr. Dieu Phan D.C.
            </span>
            , your health and satisfaction come first. Our services are tailored
            to meet your unique needs.
          </p>
          <p className="mt-3 text-base text-gray-500">
            Whether you're recovering, maintaining, or optimizing — we're here to
            guide you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {chiropracticServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-earthfire-clay-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-earthfire-clay-300"
            >
              <div className="mb-4">
                <service.icon className="h-8 w-8 text-earthfire-brick-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleBookAppointment}
            className="inline-block rounded-md bg-earthfire-brick-600 px-6 py-3 text-lg font-semibold text-white hover:bg-earthfire-brick-500 transition-colors duration-300"
          >
            Get started today
          </button>
        </div>
      </div>
    </section>
  );
}
