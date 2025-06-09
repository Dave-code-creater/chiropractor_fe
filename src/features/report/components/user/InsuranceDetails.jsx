import SectionForm from './SectionForm';
import { sendInsuranceDetails } from '../../reportAPI';

export default function InsuranceDetails() {
    const handleSubmit = async (data) => {
        await sendInsuranceDetails(data);
    };

    return <SectionForm sectionId="2" isLast onSubmit={handleSubmit} />;
}
