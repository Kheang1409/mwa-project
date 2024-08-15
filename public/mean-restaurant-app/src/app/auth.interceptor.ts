import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenKey = 'authToken';
  const authToken = localStorage.getItem(tokenKey);
  const authReq = req.clone({
    setHeaders: {
      Authorization: `${authToken}`
    }
  })
  return next(authReq);
};
