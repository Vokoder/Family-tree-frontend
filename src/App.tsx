import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PERSONS_PATH, PROFILE_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from './constants/routes.constant';
import NotFound from './pages/not-found/not-found';
import { Person } from './pages/person/person';
import { Persons } from './pages/persons/persons';
import { Profile } from './pages/profile/profile';
import { SignInForm } from './pages/sign-in';
import { SignUpForm } from './pages/sign-up';
import { AuthProtected } from './routes/auth-protected-router';
import { GuestProtected } from './routes/guest-protected-router';
import { useAppDispatch } from './store';
import { fetchRelations } from './store/relations-slice';
import { fetchUser } from './store/user-slice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchRelations());
  }, [dispatch]);

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
      <Route path={`${PERSONS_PATH}/*`} element={<Person />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
