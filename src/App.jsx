import { useEffect, useState } from 'react'
import './App.css'

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.className = theme;
    localStorage.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (username) {
      setLoading(true);
      setUserData(null);
      setTimeout(() => {
        fetch(`https://api.github.com/users/${username}`)
          .then(res => res.json())
          .then(data => {
            setUserData(data);
            setLoading(false);
          })
      }, 800);
    }
  }, [username]);

  return (
    <div className='container'>
      <header className='app-header'>
        <h1>Github user search app</h1>
        <button 
          className='theme-toggle'
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}  
        >
          {theme === 'light' ? '🌙 Koyu Mod' : '☀️ Açık Mod'}
        </button>
      </header>
      <div className="input-row">
        <input 
          type="text"
          placeholder='Github kullanıcı adı'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button
        onClick={() => {
          setUsername(inputValue)
          setInputValue('');
        }}
        >
          Ara
        </button>
      </div>
      {loading && (
        <div className="loading-spinner">
          <div className="spinner">
            <span>Yükleniyor...</span>
          </div>
        </div>
      )}
      {userData && userData.login && !loading && (
        <div className="user-info">
          <img src={userData.avatar_url} alt="profile avatar" />
          <div className="user-details">
            <h2 className='name'>{userData.name}</h2>
            <h3 className='username'>@{userData.login}</h3>
            {userData.location && (
              <p className='location'>{userData.location}</p>
            )}
            <div className="stats-row">
              <div className="stat-box">
                <span>{userData.public_repos}</span>
                Repo
              </div>
              <div className="stat-box">
                <span>{userData.followers}</span>
                Takipçi
              </div>
              <div className="stat-box">
                <span>{userData.following}</span>
                Takip Edilen
              </div>
            </div>
            <span className='created'>Oluşturuldu: {userData.created_at}</span>
          </div>
        </div>
      )}
      {userData && !userData.login && !loading && (
        <div className="not-found">Kullanıcı bulunamadı</div>
      )}
    </div>
  )
}