import { useState, useEffect } from 'react'
import OneSignal from 'react-onesignal';
import './App.css'

function App() {
  const [events, setEvents] = useState([])

  useEffect(() => {

    let ONESIGNAL_ID
    if (window.location.hostname == 'localhost') {
      console.log('OneSignal Localhost')
      ONESIGNAL_ID = '8e57fc47-487b-4671-8aff-510d255837c4'
    } else {
      console.log('OneSignal Web')
      ONESIGNAL_ID = 'fca2d04f-cb6b-4422-93ba-3f090f300e85'
    }

    OneSignal.SERVICE_WORKER_PATH = '/onesignal/OneSignalSDKWorker.js';

    OneSignal.init({ 
      appId: ONESIGNAL_ID, 
      serviceWorkerPath: '/onesignal/OneSignalSDKWorker.js', 
      serviceWorkerParam: { scope: "/onesignal/myCustomScope/" },
      allowLocalhostAsSecureOrigin: true 
    }).then(() => {
      console.log('OneSignal Init Complete')
      console.log('Push supported', OneSignal.Notifications.isPushSupported())
      console.log('Push enabled', OneSignal.Notifications.permission) 
      OneSignal.Notifications.addEventListener("permissionChange", pushPermissionsChange)
      OneSignal.Notifications.addEventListener("click", pushClick);
      OneSignal.Notifications.addEventListener("foregroundWillDisplay", pushReceived);
    })

  }, [])

  const enablePush = () => {
    OneSignal.Slidedown.promptPush({force:true})
  }

  const pushPermissionsChange = (event) => {
    console.log('push permission change', event)
  }

  const pushClick = (event) => {
    console.log('push click', event)
    event.type = 'Push Click'
    setEvents(events => [...events, event] );
  }

  const pushReceived = (event) => {
    console.log('push received', event)
    event.type = 'Push Received'
    setEvents(events => [...events, event] );
  }

  return (
    <>
      <h2 className="header">OneSignal Test PWA</h2>
      { !OneSignal.Notifications.permission && <button onClick={enablePush}>Enable Push</button> }
      <h3>Setup</h3>
      <ol>
        <li><b>npm create vite@latest onesignaltest -- --template react</b></li>
        <li>Eddit App.jsx, App.css and index.css to add this text and list events recieved</li>
        <li><b>npm install --save react-onesignal</b></li>
        <li>Removed React.StrictMode</li>
      </ol>
      <h3>OneSignal Events Received</h3>
      <div>
        <p>
          { events.map((event, id) => {
            return <span key={id}><b>{event.type}:</b> {JSON.stringify(event)}<br /></span>
          })}
        </p>
      </div>
    </>
  )
}

export default App
