import React, { useEffect, useContext } from 'react';
import ContestContext from '../../context/contests/contestContext';
import Preloader from '../layout/Preloader';
import M from 'materialize-css/dist/js/materialize.min.js';
import Contest from '../contest/Contest';
import Searchbar from '../layout/Searchbar';
import AuthContext from '../../context/auth/authContext';
const Home = (props) => {
  const contestContext = useContext(ContestContext);
  const {
    error,
    loading,
    clearErrors,
    getContests,
    contest,
    filtered,
    getUserEvents,
    todayContest,
  } = contestContext;
  const authContext = useContext(AuthContext);
  const { setgtoken, loadUser, user, isAuthenticated } = authContext;

  useEffect(() => {
    getContests();

    const queryString = window.location.search;
    if (queryString) {
      if (new URLSearchParams(queryString).get('code')) {
        console.log(queryString.slice(6));
        setgtoken({ code: queryString.slice(6) });
        loadUser();
      }
      props.history.push('/');
    }
    if (user) {
      getUserEvents();
    }
    if (error !== null) {
      M.toast(error);
      clearErrors();
    }
    //eslint-disable-next-line
  }, [error, user]);

  if (!loading && contest !== null && contest.length === 0) {
    return (
      <div className='text-5xl text-center white pt-20 text-bold'>
        No contests{' '}
      </div>
    );
  }

  return (
    <div className='white py-20 ' style={{ height: '800px' }}>
      <div className='text-center text-5xl font-mono font-bold mb-20'>
        Upcoming Contests
      </div>
      <div className='fixed-action-btn'>
          <div>
            <a 
       className="btn-floating btn-large waves-effect waves-red blue modal-trigger"
         href={isAuthenticated? ('#addcontest') : ('#logintoadd')}
       >
         <i className="material-icons">add</i>
         </a>
         <h6> </h6>
          </div>
        <a
          className={
            todayContest
              ? 'btn-large waves-effect waves-light btn btn-floating  pulse red accent-3 modal-trigger'
              : 'btn-large waves-effect waves-light btn btn-floating   red accent-3 modal-trigger'
          }
          href='#today'
        >
          <i className='material-icons white-text'> event</i>
        </a>
      </div>

      {!loading && contest !== null ? (
        <div>
          <Searchbar />
          <div className=' grid grid-cols-1 gap-4 mt-10'>
            {filtered !== null ? (
              filtered.length === 0 ? (
                <div className='container text-center text-4xl font-bold'>
                  No contest found
                </div>
              ) : (
                filtered.map((contestItem) => (
                  <Contest contest={contestItem} key={contestItem.id} />
                ))
              )
            ) : (
              contest.map((contestItem) => (
                <Contest contest={contestItem} key={contestItem.id} />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className='container '>
          <Preloader />
        </div>
      )}
    </div>
  );
};

export default Home;
