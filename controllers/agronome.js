const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
  }

  res.send("fake login/register");
};

const signin = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, John Doe`,
    secret: `Here is your authorisez data, lucky number ${luckyNumber}`,
  });
};

module.exports = {
  signin,
  signup,
};
