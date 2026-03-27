import { Route, Routes } from 'react-router-dom';

import { PERSONS_PATH, PROFILE_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from './constants/routes.constant';
import NotFound from './pages/not-found/not-found';
import { Persons } from './pages/persons/persons';
import { Profile } from './pages/profile/profile';
import { SignInForm } from './pages/sign-in';
import { SignUpForm } from './pages/sign-up';
import { AuthProtected } from './routes/auth-protected-router';
import { GuestProtected } from './routes/guest-protected-router';

function App() {
  return (
    <Routes>
      <Route element={<AuthProtected />}>
        <Route path={PROFILE_PATH} element={<Profile />} />
      </Route>

      <Route element={<GuestProtected />}>
        <Route path={SIGN_IN_PATH} element={<SignInForm />} />
        <Route path={SIGN_UP_PATH} element={<SignUpForm />} />
      </Route>

      {/* <Route path={`${TREE_PATH}/*`} element={ } /> */}
      <Route path={PERSONS_PATH} element={<Persons />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
