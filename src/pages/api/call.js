const handler = async (req, res) => {
  const { code } = req.query;
  res.redirect(`/call?coded=${code}`);
};

export default handler;
