import validator from "validator";
export const validateUser = (req, res, next) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    photo_url,
  } = req.body;

  let errors = {};

  if (!validator.isLength(username, { min: 4, max: 30 })) {
    errors.username = "Username should be between 4 to 30 characters long";
  }

  if (!validator.isLength(password, { min: 8 })) {
    errors.password = "Password should be at least 8 characters long";
  }

  if (!validator.isLength(first_name, { min: 2, max: 30 })) {
    errors.first_name = "First name should be between 2 to 30 characters long";
  }

  if (!validator.isLength(last_name, { min: 2, max: 30 })) {
    errors.last_name = "Last name should be between 2 to 30 characters long";
  }

  if (!validator.isEmail(email)) {
    errors.email = "Email is not valid";
  }

  if (!validator.isMobilePhone(phone)) {
    errors.phone = "Phone number is not valid";
  }

  if (
    !validator.isDate(date_of_birth, {
      format: "DD/MM/YYYY",
    })
  ) {
    errors.date_of_birth = "Date of birth is not valid";
  }

  // if (!validator.isURL(photo_url)) {
  //   errors.photo_url = "Photo URL is not valid";
  // }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  next();
};
