export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="container">
        <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
          <p>© {new Date().getFullYear()} Sonoth Amin. All rights reserved.</p>
          <ul className="list-unstyled d-flex">
            <li className="ms-3"><a className="link-body-emphasis" href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" aria-hidden="true" /></a></li>
            <li className="ms-3"><a className="link-body-emphasis" href="#" aria-label="Facebook"><i className="fa-brands fa-facebook" aria-hidden="true" /></a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}


