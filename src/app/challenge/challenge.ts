import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-challenge',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './challenge.html',
  styleUrl: './challenge.css',
})
export class Challenge {
  isDarkMode = signal(false);
  submitted = false;
  maxDate = new Date(2006, 11, 31); // December 31, 2006

  codingLanguages = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C#',
    'C++',
    'Go',
    'Rust',
    'PHP',
    'Ruby'
  ];

  experienceLevels = [
    'Beginner (0-1 years)',
    'Intermediate (1-3 years)',
    'Advanced (3-5 years)',
    'Expert (5+ years)'
  ];

  availableInterests = [
    'Frontend Development',
    'Backend Development',
    'Full Stack',
    'Mobile Development',
    'DevOps',
    'Cloud Computing',
    'AI/ML',
    'Data Science',
    'Cybersecurity',
    'Game Development'
  ];

  // Custom validator for password: alphanumeric, min 8 chars, starts with letter
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    // Must start with a letter
    const startsWithLetter = /^[a-zA-Z]/.test(value);
    // Must be only alphanumeric
    const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(value);
    // Must be at least 8 characters
    const isMinLength = value.length >= 8;

    const errors: ValidationErrors = {};
    
    if (!startsWithLetter) {
      errors['startsWithLetter'] = true;
    }
    if (!isAlphanumeric) {
      errors['alphanumeric'] = true;
    }
    if (!isMinLength) {
      errors['minLength'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Custom validator for birthdate: must be born in 2006 or earlier
  birthdateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const birthDate = new Date(value);
    const maxDate = new Date(2006, 11, 31); // December 31, 2006
    
    if (birthDate > maxDate) {
      return { tooYoung: true };
    }

    return null;
  }

  formdata: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, this.passwordValidator]),
    confirmPassword: new FormControl('', [Validators.required]),
    birthDate: new FormControl(null, [Validators.required, this.birthdateValidator]),
    primaryLanguage: new FormControl('', [Validators.required]),
    experienceLevel: new FormControl('', [Validators.required]),
    interests: new FormControl([] as string[], [Validators.required]),
    githubProfile: new FormControl('', [Validators.pattern(/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/)]),
    agreeToTerms: new FormControl(false, [Validators.requiredTrue])
  }, { validators: this.passwordMatchValidator });

  // Validator to check if password and confirm password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  toggleTheme() {
    this.isDarkMode.update(value => !value);
    document.body.classList.toggle('dark-theme', this.isDarkMode());
  }

  onClickSubmit() {
    this.submitted = true;
    
    if (this.formdata.valid) {
      console.log('Form Submitted!', this.formdata.value);
      alert('Membership registration successful! Welcome to Code Geeks!');
      // Reset form after successful submission
      this.formdata.reset();
      this.submitted = false;
    } else {
      console.log('Form is invalid');
      Object.keys(this.formdata.controls).forEach(key => {
        const control = this.formdata.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  getPasswordErrors(): string[] {
    const errors = [];
    const control = this.formdata.get('password');
    
    if (control?.hasError('required')) {
      errors.push('Password is required');
    }
    if (control?.hasError('startsWithLetter')) {
      errors.push('Must start with a letter');
    }
    if (control?.hasError('alphanumeric')) {
      errors.push('Only alphanumeric characters allowed');
    }
    if (control?.hasError('minLength')) {
      errors.push('Must be at least 8 characters');
    }
    
    return errors;
  }
}
