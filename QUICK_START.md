# Quick Start Checklist

Before running the application, complete these steps:

## 1. Clerk Setup (5 minutes)
- [ ] Go to https://clerk.com and sign up for free account
- [ ] Create a new application
- [ ] Copy your **Publishable Key** (starts with `pk_`)
- [ ] Copy your **Secret Key** (starts with `sk_`)
- [ ] Add `http://localhost:3000` to "Allowed redirect URLs" in settings

## 2. Backend Configuration
- [ ] Navigate to `backend` directory
- [ ] Open `.env` file
- [ ] Update these values:
  ```
  CLERK_PUBLISHABLE_KEY=paste_your_pk_here
  CLERK_SECRET_KEY=paste_your_sk_here
  MONGODB_URI=mongodb://127.0.0.1:27017/task-manager
  CLIENT_URL=http://localhost:3000
  ```
- [ ] Save the file

## 3. Frontend Configuration
- [ ] Navigate to `frontend` directory
- [ ] Update `.env.local`:
  ```
  VITE_CLERK_PUBLISHABLE_KEY=paste_your_pk_here
  VITE_API_URL=http://localhost:5000/api
  ```
- [ ] Save the file

## 4. Install Dependencies
### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## 5. Start MongoDB
```bash
mongod
```
(Keep this running in a separate terminal)

## 6. Start the Servers
### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Should see: "Server is running on port 5000"
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Should see: "Local: http://localhost:5000"
```

## 7. Test the Application
1. Open http://localhost:3000 in your browser
2. Click "Sign up"
3. Fill in your details (use a real email address)
4. Check your email and click the verification link
5. You should be logged in and see the dashboard
6. Try creating a task - it should save to the database
7. Refresh the page - the task should still be there
8. Click the user avatar in top-right to logout

## 8. Troubleshooting

### "Publishable Key not found"
- Make sure you copied the entire key starting with `pk_`
- Restart the frontend dev server after updating `.env.local`

### "Cannot create tasks"
- Check the browser console for errors
- Verify backend is running on port 5000
- Check that `VITE_API_URL` in frontend `.env.local` is correct

### "MongoDB connection failed"
- Ensure MongoDB is running (`mongod` command)
- Check `MONGODB_URI` in backend `.env`

### "Email verification not working"
- Make sure you're using a real email address
- Check spam folder for Clerk verification email
- Clerk free account might have limitations - read the email

## What Should Work After Setup

✅ Sign up with email and password  
✅ Verify email via link  
✅ Auto-login after verification  
✅ Create new tasks  
✅ Edit existing tasks  
✅ Mark tasks complete  
✅ Delete tasks  
✅ Logout and login again  
✅ Tasks persist after page refresh  

## Files You Modified

- `frontend/.env.local` - Added Clerk key and API URL
- `backend/.env` - Added Clerk keys and MongoDB URI
- Both `npm install` added dependencies

## Support

If you get stuck:
1. Read the detailed `SETUP_GUIDE.md`
2. Check `IMPLEMENTATION_SUMMARY.md` for technical details
3. Look in browser console (F12) for error messages
4. Check terminal output for backend errors
5. Visit https://clerk.com/docs for Clerk-specific help
