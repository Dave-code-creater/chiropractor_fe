import SectionForm from './SectionForm';
import { sendIntakeForm } from '../../reportAPI';

export default function IntakeForm() {
    const handleSubmit = async (data) => {
        await sendIntakeForm(data);
    };

    return <SectionForm sectionId="1" isLast onSubmit={handleSubmit} />;
}
