import { useState } from "react";

export interface RegisterFormData {
    identifier: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormErrors {
    identifier: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export function useRegisterForm() {
    const [formData, setFormData] = useState<RegisterFormData>({
        identifier: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<RegisterFormErrors>({
        identifier: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const normalized = phone.replace(/[^\d+]/g, "");
        return normalized.length >= 7;
    };

    const validateUsername = (username: string): boolean => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    const handleChange = (field: keyof RegisterFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = (): boolean => {
        const newErrors: RegisterFormErrors = {
            identifier: "",
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            confirmPassword: "",
        };

        let hasError = false;

        if (!formData.identifier) {
            newErrors.identifier = "ایمیل یا شماره تلفن الزامی است";
            hasError = true;
        } else if (formData.identifier.includes("@")) {
            if (!validateEmail(formData.identifier)) {
                newErrors.identifier = "ایمیل معتبر وارد کنید";
                hasError = true;
            }
        } else if (!validatePhone(formData.identifier)) {
            newErrors.identifier = "شماره تلفن معتبر وارد کنید";
            hasError = true;
        }

        if (!formData.firstName) {
            newErrors.firstName = "نام الزامی است";
            hasError = true;
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = "نام باید حداقل ۲ کاراکتر باشد";
            hasError = true;
        }

        if (!formData.lastName) {
            newErrors.lastName = "نام خانوادگی الزامی است";
            hasError = true;
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = "نام خانوادگی باید حداقل ۲ کاراکتر باشد";
            hasError = true;
        }

        if (!formData.username) {
            newErrors.username = "نام کاربری الزامی است";
            hasError = true;
        } else if (!validateUsername(formData.username)) {
            newErrors.username = "۳ تا ۲۰ کاراکتر (حروف، عدد یا _)";
            hasError = true;
        }

        if (!formData.password) {
            newErrors.password = "رمز عبور الزامی است";
            hasError = true;
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "رمز عبور حداقل ۸ کاراکتر باشد";
            hasError = true;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "تایید رمز عبور الزامی است";
            hasError = true;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "رمزها یکسان نیستند";
            hasError = true;
        }

        setErrors(newErrors);
        return !hasError;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
    };
}
