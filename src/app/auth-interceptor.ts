import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        auth.clearToken();
        void router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
