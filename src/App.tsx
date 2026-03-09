import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignInForm } from './pages/sign-in';
import { SignUpForm } from './pages/sign-up';
import { GuestProtected } from './routes/guest-protected-router';
import { SIGN_IN_PATH, SIGN_UP_PATH } from './constants/routes.constant';
import { AuthProtected } from './routes/auth-protected-router';
import { Profile } from './pages/profile/profile';
import { BASENAME } from './constants/env';
import NotFound from './pages/not-found/not-found';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Provider store={store}>
        <Routes>
          <Route element={<AuthProtected />}>
            <Route index element={<Profile />} />
          </Route>

          <Route element={<GuestProtected />}>
            <Route index path={SIGN_IN_PATH} element={<SignInForm />} />
            <Route path={SIGN_UP_PATH} element={<SignUpForm />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
