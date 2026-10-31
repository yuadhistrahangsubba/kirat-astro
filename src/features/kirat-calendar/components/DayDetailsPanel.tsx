import { MONTHS } from "../data/months";
import { NotesTable, SenlendatTable, YenyemTable } from "../lib/build-day-detail-tables";
import styles from "../kirat-calendar.module.css";
import type { PanchangaDay } from "../types";

interface DayDetailsPanelProps {
  p: PanchangaDay | undefined;
  year: number;
  month: number;
  day: number;
}

export function DayDetailsPanel({ p, year, month, day }: DayDetailsPanelProps) {
  return (
    <div className={styles.infoContainer}>
      <div className={styles.infoBox}>
        <h3
          id="slideUpMarker"
          lang="lif"
          style={{ fontSize: 20, color: "var(--primary)", textAlign: "center", fontFamily: "var(--font-kirat)" }}
        >
          ᤁᤡᤖᤠᤋ᤻ ᤕᤧᤴᤗᤥ
        </h3>

        <table className={styles.detailsTable} style={{ fontFamily: "var(--font-kirat)" }}>
          <tbody>
            <tr>
              <th>ᤁᤡᤖᤠᤋ᤻ ᤕᤧᤴᤏᤡᤳ:</th>
              <td>{p?.KKiratDate || "-"}</td>
            </tr>
            <tr>
              <th>ᤗᤠᤔᤡᤰᤂᤥᤰ:</th>
              <td>
                {p?.KLamikkhok || "-"}
                <p>{p?.KmissingL || ""}</p>
                <p>{p?.KnextL || "-"}</p>
              </td>
            </tr>
            <tr>
              <th>ᤔᤠᤱᤕᤢᤰ:</th>
              <td>
                {p?.KMangyuk || "-"}
                <p>{p?.KmissingM || ""}</p>
                <p>{p?.KnextM || "-"}</p>
              </td>
            </tr>
            <tr>
              <th>ᤛᤠᤶᤕᤢᤰ:</th>
              <td>
                {p?.KSamyuk || "-"}
                <p>{p?.KmissingS || ""}</p>
                <p>{p?.KnextS || "-"}</p>
              </td>
            </tr>
            <tr>
              <th>ᤂᤥᤰ:</th>
              <td>
                {p?.KKhok || "-"}
                <p>{p?.KKhok2 || "-"}</p>
              </td>
            </tr>
            <tr>
              <th>ᤁᤡᤖᤠᤋ᤻ ᤕᤧᤴ:</th>
              <td>{p?.KKiratDay || "-"}</td>
            </tr>
            <tr>
              <th>ᤜᤠᤱᤜᤠᤱᤘᤠ:</th>
              <td>
                {p?.KHangHangwa || "-"}
                <p>{p?.KnextH || "-"}</p>
              </td>
            </tr>
            <tr>
              <th>ᤗᤠᤓᤪᤧᤱ:</th>
              <td>{p?.KLabhrang || "-"}</td>
            </tr>
          </tbody>
        </table>
        <table className={styles.detailsTable} style={{ fontFamily: "var(--font-kirat)" }}>
          <tbody>
            <tr>
              <th>ᤛᤡᤱᤗᤠᤒᤠ ᤋᤡᤳᤗᤢᤶ:</th>
              <td>
                {p?.KmoonSign || "-"}
                <p>{p?.KnextmoonS || ""}</p>
              </td>
            </tr>
            <tr>
              <th>ᤌᤢᤱᤎᤠᤱᤒᤠ ᤋᤡᤳᤗᤢᤶ:</th>
              <td>
                {p?.KsunSign || "-"}
                <p>{p?.KnextsunS || ""}</p>
              </td>
            </tr>
            <tr>
              <th>ᤌᤢᤱᤎᤠᤱᤒᤠ ᤔᤠᤱᤕᤢᤰ:</th>
              <td>
                {p?.KSunMangyuk || "-"}
                <p>{p?.KnextSM || ""}</p>
              </td>
            </tr>
          </tbody>
        </table>
        <SharedTables p={p} />
        <YenyemTable p={p} />
        <SenlendatTable p={p} />
        <NotesTable />
      </div>

      <div className={styles.infoBox}>
        <h3 style={{ fontSize: 20, color: "var(--primary)", textAlign: "center" }}>
          {p?.day || "-"}, {day} {MONTHS[month]} {year}
        </h3>
        <table className={styles.detailsTable}>
          <tbody>
            <tr>
              <th>Kirat Date:</th>
              <td>{p?.KiratDate || "-"}</td>
            </tr>
            <tr>
              <th>Lamikkhok:</th>
              <td>
                {p?.Lamikkhok || "-"}
                <p>{p?.missingL || ""}</p>
                <p>{p?.nextL || "-"}</p>
              </td>
            </tr>
            <tr>
              <th>Mangyuk:</th>
              <td>
                {p?.Mangyuk || "-"}
                <p>{p?.nextM || "-"}</p>
              </td>
            </tr>
            <tr>
              <th>Samyuk:</th>
              <td>
                {p?.Samyuk || "-"}
                <p>{p?.nextS || "-"}</p>
              </td>
            </tr>
            <tr>
              <th>Khok:</th>
              <td>
                {p?.Khok || "-"}
                <br />
                {p?.Khok2 || "-"}
              </td>
            </tr>
            <tr>
              <th>Kirat Day:</th>
              <td>{p?.KiratDay || "-"}</td>
            </tr>
            <tr>
              <th>Hanghangwa:</th>
              <td>
                {p?.HangHangwa || "-"}
                <p>{p?.nextH || "-"}</p>
              </td>
            </tr>
            <tr>
              <th>Labhrang:</th>
              <td>{p?.Labhrang || "-"}</td>
            </tr>
          </tbody>
        </table>
        <table className={styles.detailsTable}>
          <tbody>
            <tr>
              <th>Moon Sign</th>
              <td>
                {p?.moonSign || "-"}
                <p>{p?.nextmoonS || ""}</p>
              </td>
            </tr>
            <tr>
              <th>Sun Sign</th>
              <td>
                {p?.sunSign || "-"}
                <p>{p?.nextsunS || ""}</p>
              </td>
            </tr>
            <tr>
              <th>Sun Mangyuk</th>
              <td>
                {p?.SunMangyuk || "-"}
                <p>{p?.nextSM || ""}</p>
              </td>
            </tr>
          </tbody>
        </table>
        <SharedTables p={p} />
        <YenyemTable p={p} />
        <SenlendatTable p={p} />
        <NotesTable />
      </div>
    </div>
  );
}

/** Sunrise/Sunset/Wanma/Namba + Muhurta + Yangdhok tables — identical in
 * both the Kirat-script and English info boxes in the original markup. */
function SharedTables({ p }: { p: PanchangaDay | undefined }) {
  return (
    <>
      <table className={styles.detailsTable}>
        <tbody>
          <tr>
            <th>Sunrise:</th>
            <td>🕒 {p?.SunRise || "-"}</td>
          </tr>
          <tr>
            <th>Sunset:</th>
            <td>🕒 {p?.SunSet || "-"}</td>
          </tr>
          <tr>
            <th>Kirat Wanma:</th>
            <td>{p?.Wanma || "-"}</td>
          </tr>
          <tr>
            <th>Kirat Namba</th>
            <td>{p?.Namba || "-"}</td>
          </tr>
        </tbody>
      </table>
      <table className={styles.detailsTable}>
        <tbody>
          <tr>
            <th>Yem Phakmura:</th>
            <td>{p?.YemPhakmura || "-"}</td>
          </tr>
          <tr>
            <th>Gulika Kala:</th>
            <td>{p?.GulikaKala || "-"}</td>
          </tr>
          <tr>
            <th>Yamaganda Kala:</th>
            <td>{p?.YamagandaKala || "-"}</td>
          </tr>
          <tr>
            <th>Dur Muhurta:</th>
            <td>
              {p?.DurMuhurta || "-"}
              <br />
              {p?.nextDur || ""}
            </td>
          </tr>
        </tbody>
      </table>
      <table className={styles.detailsTable}>
        <tbody>
          <tr>
            <th>Sammang Mura:</th>
            <td>
              {p?.SammangMura || "-"}
              <p>{p?.nextSM || ""}</p>
            </td>
          </tr>
          <tr>
            <th>Midhung Yangdhok:</th>
            <td>{p?.MidhungYangdhok || "-"}</td>
          </tr>
          <tr>
            <th>Hangsam Yangdhok:</th>
            <td>{p?.HangsamYangdhok || "-"}</td>
          </tr>
          <tr>
            <th>Akwanamang Pisang Sikkum:</th>
            <td>{p?.AkwanamangSikkum || "-"}</td>
          </tr>
          <tr>
            <th>Naga Pisang Sikkum:</th>
            <td>{p?.NagaSikkum || "-"}</td>
          </tr>
          <tr>
            <th>Singlaba Sikkum:</th>
            <td>{p?.SinglaSikkum || "-"}</td>
          </tr>
          <tr>
            <th>Singlaba Yangdhok:</th>
            <td>{p?.SinglaYangdhok || "-"}</td>
          </tr>
          <tr>
            <th>Chrang Yangdhok:</th>
            <td>{p?.ChrangYangdhok || "-"}</td>
          </tr>
          <tr>
            <th>Pisang Tangba:</th>
            <td>{p?.PisangTangba || "-"}</td>
          </tr>
          <tr>
            <th>Mangyuk Tangba:</th>
            <td>{p?.MangyukTangba || "-"}</td>
          </tr>
          <tr>
            <th>Sari Kap:</th>
            <td>{p?.SariKap || "-"}</td>
          </tr>
        </tbody>
      </table>
      <table className={styles.detailsTable}>
        <tbody>
          <tr>
            <th>Phowa Tangbe:</th>
            <td>{p?.KaliYuga || "-"}</td>
          </tr>
          <tr>
            <th>Bikram Sambat:</th>
            <td>{p?.BikramSambat || "-"}</td>
          </tr>
          <tr>
            <th>Saka Sambat:</th>
            <td>{p?.SakaSambat || "-"}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
