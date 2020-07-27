import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import { AppContext } from "../AppContext";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

export const StateSelect = () => {
  const context = useContext(AppContext);
  const classes = useStyles();

  const allUSstates = context.filteredData.processedData.uniqueStates || [];
  const selectedStates = context.filteredData.selectedStates;
  const handleSelectedStateUpdate = context.handleSelectedStateUpdate;

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">States to show</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={selectedStates}
          onChange={handleSelectedStateUpdate}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
        >
          {allUSstates.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
