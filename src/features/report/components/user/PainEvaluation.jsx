import SectionForm from './SectionForm';
import { sendPainEvaluation } from '../../reportAPI';

export default function PainEvaluation() {
    const handleSubmit = async (data) => {
        console.log('Submitting pain evaluation data:', data);
    };

    return <SectionForm sectionId="3" isLast onSubmit={handleSubmit} />;
}
