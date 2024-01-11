import { 
    TextInputProps as RNTextInputProps,
} from 'react-native';
import React from 'react';
import {
    useFormContext,
    UseControllerProps
} from 'react-hook-form';

import ControlledInput from './ControlledInput';

interface TextInputProps extends RNTextInputProps, UseControllerProps {
    label?: string
    defaultValue?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    height?: number
    minHeight?: number
}

const TextInput = (props: TextInputProps) => {
    const { name } = props;
    const formContext = useFormContext();

    if (!formContext || !name) {
        const msg = !formContext ? "TextInput must be wrapped by FormProvider" : "Name must be defined";
        console.warn(msg);

        return null;
    }

    return <ControlledInput {...props} />
}

export default TextInput;