import React from "react";
import {
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function AccordionGuide() {
  return (
    <div>
      <Container maxWidth="sm" className="pt-24 pb-12">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Guide to This Site</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="list-disc list-outside ml-4">
              <li className="mb-1">Each vote consumes 1 XRP.</li>
              <li className="mb-1">
                To participate, you must install the browser extension CROSSMARK
                and set up a wallet.
              </li>
              <li className="mb-1">
                Each voting period lasts for one week, starting from 0:00 on
                Sunday.
              </li>
              <li className="mb-1">Voting closes at 23:50 on Saturday.</li>
              <li className="mb-1">
                90% of the XRP accumulated in the owner&lsquo;s account during
                the week is distributed among the users.
              </li>
              <li className="mb-1">
                Winners are requested to click the CLAIM button from Claim
                Checks to receive their prize (using the XRPL&lsquo;s Check
                feature).
              </li>
              <li>
                If there are no winners, the prize will be carried over to the
                following week.
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>
      </Container>
    </div>
  );
}

export default AccordionGuide;
