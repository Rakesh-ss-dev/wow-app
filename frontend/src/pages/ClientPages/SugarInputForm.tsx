import ComponentCard from '../../components/common/ComponentCard';
import BloodSugarKnob from '../../components/ui/knobs/BloodSugarKnob'

const SugarInputForm = () => {
  return (
    <ComponentCard title='Fasting Blood Sugar' desc='Adjust the knob to set your blood sugar level' className='max-w-2xl mx-auto'>
      <BloodSugarKnob />
    </ComponentCard>
  )
}
export default SugarInputForm;