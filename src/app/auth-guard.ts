import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { Users } from './users';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const users = inject(Users);
  const router = inject(Router);

  if (auth.getToken()) {
    auth.loadMe();
    users.loadUsers();
    return true;
  }

  return router.createUrlTree(['/login']);
};
