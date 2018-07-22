Dependencies and Init Project

---

- Install dependencies (mention issues with Node 10; install React / Redux Dev tools which is why they should dl either Chrome/Firefox)
- Init project - npx create-react-app (or dl repo with all dependencies)
- Clean up - remove logo, sw, markup, add component folder
- Install react-router-dom / firebase
- Set up routes (Register, Login, App/Chat)
- Set up basic markup in Register / Login components and hook to index.js (make sure you can navigate bet. pages)
- Add firebase config (in index.js)

Add Register Form

---

- Add semantic-ui-react and semantic-ui-css; [Cover ability to create custom styles for semantic ui or change color attr]
- Add import 'semantic-ui-css/semantic.min.css' and remove index.css
- Go to layouts for Login form for semantic ui
- Create more inputs for signing up (in Register), add names to form, create state and registerUser function and log 'register' on form submit

Create controlled inputs and register user and validation funcs

---

- Hook up one way data binding to state (with handleChange) look to see that state value are updated with React DevTools
- Pass values back down to inputs with value attr
- Import firebase from index.js file to use firebase.auth() to register a user; [make note about using console.dir to make sure that the firebase object that you export contains an auth function within services]
- Create isFormValid function to check form upon calling the registerUser function, add errors property to state object
- Write the two associated functions--isFormEmpty and isPasswordValid and link them with isFormValid

Provide Error Handling

---

- Clear errors when user is successfully registered; talk about adding .trim() to the end of event.target.value in handleChange, and add required="true" to each of the inputs
- Conditionally show errors as part of a message component; [{!!errors.length && this.displayErrors()}]
- Add 'error' to class names of certain inputs according to whether there was an error [i.e. className={!this.state.passwordsValid ? "error" : null}] // [also make note of the fact that when form has the attribute error, it will show all error messages]
  -- Show how you can push an object onto the errors array in state which contains a message and an error type [{ message: 'alskjdf', type: 'password' }]; this gives you can convenient way to create a ternary to change the classname of an input according to whether there is a certain error (with errors.some(conditionFunc))
- Also show that firebase returns to us validations errors; add those errors to the error object
- When you add messages to the error object, show the benefit of using push over concat (since concat returns the entire array whereas push will just return its new length)

Add Props to Newly created User and Save to DB

---

- Add user.updateProfile and add displayName and profileImg as props, use md5 to create gravatar img
- Add saveUser to Register component and add usersRef to state object, then add saveUser function to another then statement after updateProfile
- In the saveUser function, make a child for the usersRef prop on the state object and set the two properties that we created with updateProfile (displayName and photoURL)
- After saving the User with saveUser, redirect to the home page; take a look at the user saved in the database

Redux Setup

---

- Create the action for the store (actions folder, index.js and types.js) go through how it's just a function that updates the state object
- How does it update this object? Let's create it in the reducers folder (index.js and user_reducer.js); give it an initial state (containing a 'currentUser' prop and 'isAuthenticated' prop) and switch statement
- Then show how we will have multiple reducers and combine them in (reducers/index.js)
- How do we provide access to this store to all components? Create store in index.js and wrapping our entire app with it using the Provider component

Add Redux Tools

---

- Create the store in this fashion: const store = createStore(
  root_reducer,
  composeWithDevTools(applyMiddleware(ReduxPromise))
  );[https://stackoverflow.com/questions/36377911/reactredux-uncaught-error-expected-the-reducer-to-be-a-function]
- Install Redux Dev Tools from Chrome Extensions (if wasn't mentioned in intro), and use redux-devtools-extension to wrap applyMiddleware (mention the /developmentOnly setting when deploying, also see Osmani's tweet)

Use Redux to Set Current User in State / mapStateToDispatch

---

- Bring the action into the Register component with the combine function, set mapStateToProps to null and just destructure setUser from mapStateToDispatch
- Register a user and see how the state is updated in Redux dev tools
- Show that user's properties in the Firebase db (displayName and photoURL)

Add Firebase Rules

---

- Change the rules for the realtime database (anybody can read or write to our application currently)
- Write out the rules to for read/write permission as well as validation; do a test for a given user that's already in the db to demonstrate how it works (when there is a name supplied to the name and avatar properties)

Structure Login Component

---

- Copy markup from Register to Login, remove name and passwordConfirm inputs, change link Register form, change title
- Add state object (email, password, errors, loading) and destructure properties from state in render
- Add loginUser function, add isFormValid function, remove console logs from Register component and add them to loginUser function

Add signin from Firebase / use setUser again

---

- Use firebase.auth().signIn..., add connect from 'react-redux' and setUser from actions, call setUser within signInUser and redirect to home
- Show password error on login from firebase and change the className of the password input to include el.includes('password')

Add PrivateRoutes / mapStateToProps

---

- Create a private route definition and use mapStateToProps to now GET a value from Redux; we want to map the state to props so we can use the isAuthenticated value (when user authenticates) to conditionally show the user the chat (if auth) or to redirect him to the login page if not [https://stackoverflow.com/questions/43520498/react-router-private-routes-redirect-not-working] / [see Tyler McGinnis RR4 for good explanation of private routes]
- Create map state to props in the index.js file and pass through the Root component (and declare Root with let so we can use 'connect' func to mapStateToProps)

Add App/Chat Component Markup

- Create 'Sidebar' and 'Messages' components within the App component
- Create some basic markup for both components, export and import in the App component and look at them in the browser (may need to remove PrivateRoute to see result)
- Add styles to 'Sidebar' component
- Create 'CurrentUser' component to put inside 'Sidebar' component, create Sidebar folder for both components, reroute path to App.js, create basic markup for 'CurrentUser' import to Sidebar, check to make sure you can see in browser
- Add styles to 'CurrentUser' component
- Bring in connect and use mapStateToProps to bring in the values for the currentUser
- Interpolate diplayName and their photoURL
- Show how you can destructure currentUser from this.props (above render) in 'CurrentUser'
- Add onClick to button / icon next to avatar and hook it up to a logoutUser function, bring in firebase, use .signOut() on firebase.auth()
- Create a new action 'logoutUser', set return user to their initialState values [show that you can add another case to the 'setUser' statement in the user_reducer or that you can just spread the initial state object to state.user]
  -add 'logoutUser' within mapStateToDispatch parameters and import it, call it after logging out with firebase, then redirect back to the login page
- Since we don't have access to the history object (unless we pass it down from the App component via props), we we'll use withRouter to redirect after logging our user out

Channels Component

---

- Create 'Channels' component, add basic markup, and import into Sidebar component (under 'CurrentUser'), take a look at it in browser
- Add better markup for 'Channels', add styles if necessary
- Add state, add 'channels', 'new_channel', and 'errors' to state; add handleChange function to update state when typed into input
- Add a couple functions to open / close the modal (i.e. handleOpen / handleCloseModal )
- Add an 'addChannel' function to add a new property 'channels' to the database, and when it adds a channel, it will have it's own random id, which contains a name for the channel and an id
- Bring in firebase, add prop to state--channelsRef
- Set up logic in 'addChannel', add displayErrors for error handling if it can't be added
- Destructure state properties in render used in return
- Will be not allowed to add new channels at first (should see error message); we need to add more permission to our firebase rules, publish them and try to add a channel again
- add 'addListeners' function which be a listener for when a new child is added to the 'channels' ref to Firebase; also add 'detachListeners' and hook both of them up to componentDidMount and componentWillUnmount respectively
- Delete li (containing an example channel) and create display Channels function, which will loop through the channels prop on state and output list

Change Current Channel of User

---

- Create new action setCurrentChannel to run within 'addListeners'; add currentChannel property to initial state object and modify other cases, add setCurrentChannel action and add reducer case for it, pass in this.state.channels[0] to when you call the function (it is called according to the value of this.state.firstLoad)
- Create 'setActiveChannel' function, which will compare the current channel passed in to the channel in the user's state (and return either true or false); so to get that we need to mapStateToProps
- Call 'setActiveChannel' within displayErrors where you loop over each of the items in the 'channels' property
- Add onClick to each of the lis and add a function 'changeChannel' in which you call 'setCurrentChannel'

Add Messages

---

- Add Messages folder and move 'Messages' component into it
- Add markup for 'Messages' component and add styles
- Create 'MessageForm' component, add markup and styles to it, and put it within the 'Messages' component; add 'sendMessage' function to 'MessageForm'
- Show that we are going to add a new 'messages' child to our Firebase db, which will contain 'content', 'timestamp' and a reference to the user containing their id, name and avatar
- Go to 'Messages' and add 'messagesRef' property, pass messagesRef down to MessageForm as a prop (maybe log it with componentDidMount) to 'sendMessage'
- Use mapStateToProps to get the currentChannel / currentUser within MessageForm, add them to sendMessage function, create newMessage as described above, add as child to 'messages' child, create error property on state obj
- Once again you'll get permission errors when you try to send a message, so you'll set more rule in Firebase
- After adding the rules for 'messages', try sending a message again and look at the database
- Check within sendMessage whether it is the current channel
- Move where you create a newMessage into its own function 'createMessage' and call the function within 'sendMessage'
- Add componentDidMount/WillUnMount with addListeners and detachListeners again, listen for child_added again, add values to messages in state obj
- Open up 'ui messages' div and create displayMessages function to show all messages
- MapStateToProps in Messages to get 'currentChannel'
- Add 'channel' property to state, set value of this.props.currentChannel to channel in local state, detach listeners if 'channel' !== null (the original value)
- Needed to take out some of the rules in firebase:

          ".validate": "newData.hasChildren(['content', 'timestamp', 'user'])",
          "content": {
            ".validate": "newData.val().length > 0"
          },
          "user": {
            ".validate": "newData.hasChildren(['name', 'avatar', 'id'])",
            "id": {
              ".validate": "newData.val() === auth.uid"
            }
          }

- Note! Added it back in after I realized i was clearing the message value for the MessageForm, but wasn't clearing the actual value in the textarea. This caused Firebase to rejected any message that wasn't cleared out manually and typed in again. So i added a ref to the textarea and cleared it out in the .then() part of sending the message

Message Component

---

- Change the p tag that you are using to insert the individual message into an individual 'Message' component, give it styles, pass in the entire message as a prop
- Add isOwnMessage function to add class to messages that are equal to the currentUser's uid
- DL moment and create fromNow function to convert timestamp to time from present
- Add transition for each of the Messages using react-transition-group

Users component

---

- Add users components to Sidebar folder
- Have it hold an array of users in state, import Users into Sidebar component
- Add styles for Users component, add corresponding markup
- Use mapStateToProps to get value of currentUser
- Again make addListeners and detachListeners functions (associated with mounting/unmounting)
- Bring in firebase and make a 'usersRef' state property
- Within addListeners, listen for when a child is added, then create a user object and add it to the users array in state
- Change the firebase rules so you can use the 'users' ref
- Check your local state so you can see that someone else who has used the chat has now been added to the array as an offline user
- Iterate over the users in the array (directly within the markup)
- Add a 'connectedRef' property and a 'presenceRef' property within state
- Add another conditional for present users in the chat within addListeners
- Add addStatusToUser function to conditionally add a status property with the value of 'online' or 'offline' depending on whether we are listening for child_added or child_removed
- Now we need to add rules for this 'presence' ref
- Use connectedRef in addListeners which will add a presence ref, add a user id to that and set it equal to true (initially)
- Use reduce to update whether a user is online or offline
- Create a function called 'isOnline' to dynamically show whether a user is online or not
- Go to 'CurrentUser' component and add a 'presenceRef' to the state object, within logout, use it to remove the 'presence' ref in the db for a given user, and the light should change from green to red (when loggedout)
- Add detachListeners function where you remove all of the refs in the state object upon unmounting the component

Add Private Messages

- Add onClick to element in Users component where you iterate over users
- Create 'changeChannel' function and pass in the user; we will use this to create a new entry in our db - privateChannels
- Create 'getChannelId' function and provide logic to it
- Add mapDispatchToProps to set the current channel after creating the channel object and pass it to setCurrentChannel
- Add a new property to the initialState object in user_reducer -- isPrivateChannel: false
- Create a new action--setPrivateChannel that just changes the boolean value of 'isPrivateChannel'; introduce it both to the changeChannel function in 'Channels' and in the 'Users' component (true in Users, false in Channels)
- Now when you click on another User, it should take you to an empty channel
- Create a new function in Users, isChannelActive which will check if a given channel is active; for this, get the 'currentChannel' value from mapStateToProps
- Then use the return value of isChannelActive to change the class of the container element that you're iterating over (give it the 'is_active' class)
- Take a look at Redux tools to see whether a given user's value for isPrivateChannel true or false

- Create function 'getMessagesRef' within 'Messages' to toggle whether we use a privateMessages ref or the normal messagesRef (within our addListeners function, which uses the messagesRef); map isPrivateChannel to props to do this
- Call this.getMessagesRef within addListeners and then assign to a variable 'ref'
- Now we need to add some rules for this 'privateMessages' child that we want to give to our database
- Once you've added the rules, within MessageForm, in the sendMessage function, change the messagesRef prop to a getMessagesRef prop
- in 'Messages' component, add 'listeners' property on state object, and add 'addToListeners' function
- Call addToListeners within addListeners, and look at the results in the state object when you click between channels in the browser
- Can iterate over the listeners in detachListeners and call off each of them (can comment out the previous code), then after that set the listeners and messages array to []
- Removed this line from the rules (part of the 'messages' child):
  "id": {
  ".validate": "newData.val() === auth.uid"
  }
- Get the channel name by creating a function 'getchannelName' in Messages component, depending on whether channel is private or not, prefix the channel name with @ or #
