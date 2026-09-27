import styles from "./CountryItem.module.css";
import { getFlagUrl } from "../utils/flags";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <img src={getFlagUrl(country.emoji)} alt={country.country} />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
