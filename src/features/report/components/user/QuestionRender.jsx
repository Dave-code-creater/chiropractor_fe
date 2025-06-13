
import { renderQuestionByType } from "../../../../utils/renderQuesFuncs"

export default function QuestionRenderer({
  questions,
  formData,
  setFormData,
  baseClasses,
  painMap,
  setPainMap
}) {
  return (
    <>
      {questions.map((question) =>
        renderQuestionByType({
          question,
          formData,
          setFormData,
          commonFieldsetClasses: baseClasses,
          painMap,
          setPainMap
        })
      )}
    </>
  )
}