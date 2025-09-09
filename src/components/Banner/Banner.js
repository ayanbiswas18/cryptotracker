import { Container, makeStyles, Typography, Grid, Card, CardContent } from "@material-ui/core";
import { TrendingUp, Security, Speed, Analytics } from "@material-ui/icons";
import Carousel from "./Carousel";

const useStyles = makeStyles((theme) => ({
  banner: {
    background: "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(123, 104, 238, 0.1) 100%)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 30% 20%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(123, 104, 238, 0.15) 0%, transparent 50%)
      `,
      pointerEvents: "none",
    },
  },
  bannerContent: {
    minHeight: 500,
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(4),
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },
  heroSection: {
    textAlign: "center",
    marginBottom: theme.spacing(4),
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: 800,
    marginBottom: theme.spacing(2),
    background: "linear-gradient(45deg, #00d4ff, #7b68ee, #ff6b6b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontFamily: "'Inter', sans-serif",
    [theme.breakpoints.down("md")]: {
      fontSize: "2.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
    },
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: 400,
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: 1.6,
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.1rem",
    },
  },
  featuresGrid: {
    marginBottom: theme.spacing(4),
  },
  featureCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 20px 40px rgba(0, 212, 255, 0.2)",
      border: "1px solid rgba(0, 212, 255, 0.3)",
    },
  },
  featureIcon: {
    fontSize: "2.5rem",
    color: "#00d4ff",
    marginBottom: theme.spacing(1),
  },
  featureTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "white",
    marginBottom: theme.spacing(1),
    fontFamily: "'Inter', sans-serif",
  },
  featureDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.95rem",
    lineHeight: 1.5,
  },
  carousel: {
    marginTop: theme.spacing(2),
  },
}));

const features = [
  {
    icon: <TrendingUp />,
    title: "Real-time Data",
    description: "Live cryptocurrency prices and market data updated every second"
  },
  {
    icon: <Security />,
    title: "Secure Tracking",
    description: "Your portfolio data is stored securely with advanced encryption"
  },
  {
    icon: <Speed />,
    title: "Lightning Fast",
    description: "Optimized performance for instant data loading and smooth experience"
  },
  {
    icon: <Analytics />,
    title: "Advanced Analytics",
    description: "Comprehensive charts and insights to make informed decisions"
  }
];

function Banner() {
  const classes = useStyles();

  return (
    <div className={classes.banner}>
      <Container className={classes.bannerContent}>
        <div className={classes.heroSection}>
          <Typography className={classes.title}>
            Professional Crypto Dashboard
          </Typography>
          <Typography className={classes.subtitle}>
            Track, analyze, and manage your cryptocurrency investments with our advanced portfolio management platform
          </Typography>
        </div>

        <Grid container spacing={3} className={classes.featuresGrid}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className={classes.featureCard}>
                <CardContent style={{ textAlign: "center", padding: "24px" }}>
                  <div className={classes.featureIcon}>
                    {feature.icon}
                  </div>
                  <Typography className={classes.featureTitle}>
                    {feature.title}
                  </Typography>
                  <Typography className={classes.featureDescription}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <div className={classes.carousel}>
          <Carousel />
        </div>
      </Container>
    </div>
  );
}

export default Banner;