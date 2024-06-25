import { FieldArray } from "react-final-form-arrays"
import Button from "./Button"
import { AddIcon, CloseIcon } from "@icons/index"
import Input from "./Input"
import { Field } from "react-final-form"
import Checkbox from "./Checkbox"
import Select from "./Select"
import TimePicker from "./TimePicker"

interface DynamicFormComponent {
  name: string
  type: string
  label: string
  inputType?: string
  options?: any[]
  placeholder?: string
  pattern?: string
  helperText?: string
  errorText?: string
  multiple?: boolean
  disabled?: boolean
  validate?: any | any[]
}

interface DynamicFieldProps {
  label?: string
  id: string
  name: string
  components: DynamicFormComponent[]
  inputFormFn?: any
  editOnly?: boolean
}

function generateField(
  component: DynamicFormComponent,
  key: string,
  inputFormFn?: any,
) {
  const name = `${key}.${component.name}`
  switch (component.type) {
    case "checkbox":
      return (
        <Field
          name={name}
          type="checkbox"
          disabled={component.disabled}
          validate={component.validate}
        >
          {({ input }) => (
            <Checkbox id={name} description={component.label} {...input} />
          )}
        </Field>
      )
    case "input":
      return (
        <Field
          name={name}
          disabled={component.disabled}
          validate={component.validate}
        >
          {({ input, meta }) => (
            <Input
              id={name}
              type={component.inputType}
              label={component.label}
              placeholder={component.placeholder}
              pattern={component.pattern}
              isError={meta.error && meta.touched}
              errorText={meta.error}
              disabled={component.disabled}
              {...input}
            />
          )}
        </Field>
      )
    case "select":
      return (
        <Field
          name={name}
          disabled={component.disabled}
          validate={component.validate}
        >
          {({ input, meta }) => (
            <Select
              id={name}
              options={component.options || []}
              label={component.label}
              multiple={component.multiple}
              disabled={component.disabled}
              isError={meta.error && meta.touched}
              errorText={meta.error}
              {...input}
            />
          )}
        </Field>
      )
    case "timePicker":
      return (
        <Field
          name={name}
          disabled={component.disabled}
          validate={component.validate}
        >
          {({ input, meta }) => (
            <TimePicker
              id={name}
              inputFormFn={inputFormFn}
              label={component.label}
              placeholder="HH:MM"
              isError={meta.error && meta.touched}
              errorText={meta.error}
              disabled={component.disabled}
              {...input}
            />
          )}
        </Field>
      )
  }
}

function DynamicField({
  label,
  id,
  name,
  components,
  inputFormFn,
  editOnly = false,
}: DynamicFieldProps) {
  return (
    <>
      <div>{label}</div>
      <FieldArray name={name} id={id}>
        {({ fields }) => {
          return (
            <div>
              {fields.map((key, index) => (
                <div key={key} className="flex gap-6 items-center">
                  {!editOnly && (
                    <div className="flex items-center pl-3 pr-6 gap-6 mb-4">
                      <Button
                        variant="text"
                        icon={<AddIcon />}
                        onClick={() => {
                          fields.push({})
                        }}
                      />
                      <Button
                        variant="text"
                        icon={<CloseIcon />}
                        color="cinnabar"
                        disabled={index == 0}
                        onClick={() => {
                          fields.remove(index)
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-6">
                    {components.map(component => {
                      return (
                        <div className="w-full">
                          {generateField(component, key, inputFormFn)}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        }}
      </FieldArray>
    </>
  )
}

export default DynamicField
