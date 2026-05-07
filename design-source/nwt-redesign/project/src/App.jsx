// App root
function App() {
  return (
    <>
      <Nav/>
      <Hero/>
      <Protect/>
      <Industries/>
      <Approach/>
      <Practices/>
      <Stats/>
      <Attorneys/>
      <Testimonial/>
      <News/>
      <FAQ/>
      <Awards/>
      <Contact/>
      <Footer/>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
