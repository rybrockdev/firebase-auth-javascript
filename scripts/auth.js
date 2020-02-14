// ******** listen for auth status changes *********

auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('guides').get().then(snapshot => {
            setupGuides(snapshot.docs);
            setupUI(user);
        });
    } else {
        setupUI();
        setupGuides([]);
    }
});
// ******** create a new guide **********
const createForm = document.querySelector('#create-form');

createForm.addEventListener('submit', (event) => {
    event.preventDefault();
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value,
    }).then(() => {
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset()
    }).catch(error => {
        console.log(error.message);
    })
});
// ******** signup a user **********

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // ********** get the users info *********

const email = signupForm['signup-email'].value;
const password = signupForm['signup-password'].value;
// console.log(email, password);



// ******** sign a user up **********

auth.createUserWithEmailAndPassword(email, password).then(cred => {
    // console.log(cred.user);
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset()
});
});

// ********** logout user **********

const logout = document.querySelector('#logout');
logout.addEventListener('click', (event) => {
    event.preventDefault();
    auth.signOut()
});

// ******** login *************

const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // fetch user form data *********
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred.user);
        // close modal and rest login form ******
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    });
});









