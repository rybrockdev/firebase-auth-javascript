// use of square bracket notation keeping the callouts consitent.

// ******* add admin cloud function **********

const adminForm = document.querySelector('.admin-actions');

adminForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({ email: adminEmail }).then(result => {
        console.log(result);
    })
})

// ******** listen for auth status changes *********

auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        })
        db.collection('guides').onSnapshot(snapshot => {
            setupGuides(snapshot.docs);
            setupUI(user);
        }, error => {
            console.log(error)
        })
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
    return db.collection('users').doc(cred.user.uid).set({
        bio: signupForm['signup-bio'].value
    })
    // console.log(cred.user);
    
}).then(() => {
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









