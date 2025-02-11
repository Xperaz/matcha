import { CompleteFormData } from "@/schemas/CompleteFormSchema";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface formValuesType {
  formValues: Partial<CompleteFormData>;
  // eslint-disable-next-line no-unused-vars
  updateFormValues: (x: Partial<CompleteFormData>) => void;
  currentStep: number;
  previousStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setPreviousStep: Dispatch<SetStateAction<number>>;
}

interface Props {
  children: ReactNode;
}

const FormContext = createContext<formValuesType | null>(null);

export const FormProvider = ({ children }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [formValues, setFormValues] = useState({});

  const updateFormValues = (updateData: any) => {
    setFormValues((prevData) => ({ ...prevData, ...updateData }));
  };

  const values = {
    formValues,
    updateFormValues,
    currentStep,
    setCurrentStep,
    previousStep,
    setPreviousStep,
  };

  return <FormContext.Provider value={values}>{children}</FormContext.Provider>;
};

export const useCompleteFormContext = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("context must be use within the context provider");
  }

  return context;
};
