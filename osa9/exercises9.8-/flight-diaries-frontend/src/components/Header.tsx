interface HeaderProps {
  header: string;
}

const Header = ({ header }: HeaderProps) => {
  return (
    <h1>
      {header}
    </h1>
  );
};

export default Header;