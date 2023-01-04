import "./App.css";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Tooltip,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Avatar,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MenuIcon from "@mui/icons-material/Menu";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { useState, useEffect } from "react";

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import sidebg from "./Assets/sidebg.png";
import firstWhiteIcon from "./Assets/white-ico.svg";
import secondWhiteIcon from "./Assets/whiteicon.svg";
import yellowIcon from "./Assets/yellow-ico.svg";

function App() {
  const [file, setFile] = useState(null);
  const isFileUploaded = file ? true : false;

  const [tableData, setTableData] = useState([]);
  const columns = tableData.length ? Object.keys(tableData[0]) : [];

  const csvFileReader = () => {
    if (isFileUploaded) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target.result;
        var lines = text.split("\n");
        // console.log("start:", lines);

        var columns = [];
        var list = [];

        if (lines.length >= 1) {
          columns = lines[0].split(",");

          for (let index = 1; index < lines.length; index++) {
            var row = lines[index].split(",");
            var obj = {};
            for (var j = 0; j < row.length; j++) {
              obj[columns[j]] = row[j];
            }
            list.push(obj);
          }
          // console.log("final list", list);
          setTableData(list);
        }
      };

      reader.readAsText(file);
    }
  };
  useEffect(() => {
    csvFileReader();
  }, [file]);

  // formula
  const [formula, setFormula] = useState([]);

  const [error, setError] = useState(null);
  const isError = Boolean(error);
  const ERRORS = {
    property_invalid: {
      key: "property_invalid",
      msg: "You have entered invalid property",
    },
    column_invalid: {
      key: "column_invalid",
      msg: "You have entered invalid Column Name",
    },
    property_value_invalid_split: {
      key: "property_value_invalid_split",
      msg: "You have entered invalid Property Value. Value between 1 and 10. ",
    },
    property_value_invalid_padd: {
      key: "property_value_invalid_padd",
      msg: "You have entered invalid Property Value. Value between 1 and 100. ",
    },
    property_value_invalid_format: {
      key: "property_value_invalid_format",
      msg: "Please enter valid format for property value",
    },
    invalid_format: {
      key: "invalid_format",
      msg: "Please enter valid format",
    },
  };
  const resetError = () => {
    setError(null);
    // setFormula([]);
  };

  const noError = formula.length === 4 && !isError;

  var newTableData = [];
  var newColumns = [];
  const PROPERTIES_LIST = {
    SPLIT: "SPLIT",
    PADD: "PADD",
  };
  var properties = Object.keys(PROPERTIES_LIST);

  const isSplitProperty = (value) => {
    return value === PROPERTIES_LIST.SPLIT;
  };
  const isPaddProperty = (value) => {
    return value === PROPERTIES_LIST.PADD;
  };

  if (noError) {
    var propertyName = formula[0];
    const currentColumnName = formula[1];
    const newColumnName = formula[2];
    var DIGIT = parseInt(formula[3]);
    newTableData = tableData.map((currentRow) => {
      //  split property
      if (isSplitProperty(propertyName)) {
        const SPLIT_DIGIT = DIGIT;
        var value = "";
        value = currentRow[currentColumnName]?.substring(0, SPLIT_DIGIT);
        return { ...currentRow, [newColumnName]: value };
      } else if (isPaddProperty(propertyName)) {
        var PADD_DIGIT = DIGIT;
        var value =
          Array(PADD_DIGIT).fill(" ").join("") + currentRow[currentColumnName];
        return { ...currentRow, [newColumnName]: value };
      }
      {
        return { ...currentRow };
      }
    });

    newColumns = newTableData.length ? Object.keys(newTableData[0]) : [];
  }

  // console.log("noError spot :", noError,formula,!isError);
  // console.log("newtable spot:", newTableData);

  const deleteFile = () => {
    setFile(null);
    resetError();
  };
  const downloadCSVFile = () => {
    const element = document.createElement("a");
    var newCSV = "";
    //  we are doing this because by default there is a carriage return character in the last column
    //  so we have to remove this
    //  first we are adding columns
    var copyColumns = Object.keys(newTableData[0]);
    copyColumns = copyColumns.map((value) => value.replace("\r", ""));
    newCSV += copyColumns + "\n";

    //  secondly we are adding rows
    newTableData.map((rows, row_index) => {
      newCSV += Object.values(rows).map((column) => column.replace("\r", ""));
      if (row_index !== newTableData.length - 1) {
        newCSV += "\n";
      }
    });
    const file = new Blob([newCSV], {
      type: "text/csv",
    });
    element.href = URL.createObjectURL(file);
    element.download = element.href.split("/")[3] + ".csv";
    element.click();
    URL.revokeObjectURL(element.href);
  };

  return (
    <div>
      <Grid
        container
        spacing={2}
        sx={{
          position: "absolute",
          height: "100vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "16px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#1788df",
            border: "4px solid transparent",
            borderRadius: "10px",
            backgroundClip: "padding-box",
            minHeight: "100px",
          },
        }}
      >
        {/* first column 25% */}
        <Grid
          item
          xs={3}
          sx={{
            backgroundImage: `url(${sidebg})`,
            height: "93vh",
            padding: "20px",
            borderBottomRightRadius: "50px",
            position: "fixed",
          }}
        >
          <Box>
            <Box sx={{ mt: 6, ml: 3, mb: 3 }}>
              <Typography
                variant="h5"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                User Controls
              </Typography>
            </Box>
            <Box sx={{ m: 3 }}>
              <Box>
                <Stack direction="row" alignItems="center">
                  <img src={secondWhiteIcon} />
                  <Typography
                    sx={{ color: "#ffc400", fontWeight: "600", ml: 1 }}
                  >
                    Input for Padding Function
                  </Typography>
                </Stack>
                {/* 1st block */}
                <Box my={2}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "white",
                      fontWeight: "300",
                      letterSpacing: "1px",
                    }}
                    className="sidebar_text_block"
                  >
                    Enter the Feature Hanle Which You Want to Add Padding. Eg:
                    Hrid, Hrid_new, 4
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="PROPERTY NAME, COLUMN NAME, NEW COLUMN NAME, PROPERTY VALUE">
                <TextField
                disabled={!isFileUploaded}
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    width: "200px",
                    mt: 1,
                    mb: 2,
                  }}
                  onBlur={(e) => {
                    var value = e.target.value.split(",");
                    //  our formula has 4 properties
                    if (value.length === 1 && value[0] == "") {
                      resetError();
                    } else if (value.length === 4) {
                      // here we are checking property name
                      if (!properties.includes(value[0])) {
                        setError(ERRORS.property_invalid.key);
                      }
                      //here we are checking column name
                      else if (!columns.includes(value[1])) {
                        setError(ERRORS.column_invalid.key);
                      }
                      //  here we are checking whether property value is in invalid  format or not
                      else if (isNaN(parseInt(value[3]))) {
                        setError(ERRORS.property_value_invalid_format.key);
                      }
                      //  here we are checking whether property value is between the range or not
                      else if (
                        isSplitProperty(value[0]) &&
                        (parseInt(value[3]) < 1 || parseInt(value[3]) > 10)
                      ) {
                        setError(ERRORS.property_value_invalid_split.key);
                      } else if (
                        isPaddProperty(value[0]) &&
                        (parseInt(value[3]) < 1 || parseInt(value[3]) > 100)
                      ) {
                        setError(ERRORS.property_value_invalid_padd.key);
                      } else {
                        // here we are resetting the error state
                        resetError();
                      }
                      //  saving the whole formula in a state in an array format
                      setFormula(value);
                    } else {
                      //  in the end if above criteria passes then it means some invalid format
                      setError(ERRORS.invalid_format.key);
                    }
                  }}
                  size="small"
                  placeholder="ENTER FORMULA"
                />
              </Tooltip>
              {/* 2nd block */}
              <Box>
                <Stack direction="row" alignItems="center">
                  <img src={firstWhiteIcon} />
                  <Typography
                    sx={{ color: "#ffc400", fontWeight: "600", ml: 1 }}
                  >
                    Add Left Padding =
                  </Typography>
                </Stack>
                <Box my={2}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "white",
                      fontWeight: "300",
                      letterSpacing: "1px",
                    }}
                    className="sidebar_text_block"
                  >
                    Feature Name, Name for New Feature, No of Padding You Want.
                  </Typography>
                </Box>
              </Box>
              {/* 3rd block */}
              <Box>
                <Stack direction="row" alignItems="center">
                  <img src={firstWhiteIcon} />
                  <Typography
                    sx={{ color: "#ffc400", fontWeight: "600", ml: 1 }}
                  >
                    Sub String =
                  </Typography>
                </Stack>
                <Box my={2}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "white",
                      fontWeight: "300",
                      letterSpacing: "1px",
                    }}
                    className="sidebar_text_block"
                  >
                    Feature Name, Name for New Splitted Feature, Starting Number
                    From Where You Want Split, Number From Where You Want to
                    Stop Split.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        {/*  second column 75% */}
        <Grid
          item
          xs={8.7}
          sx={{
            marginLeft: "25%",
          }}
        >
          <AppBar
            position="absolute"
            sx={{
              width: "75%",
              backgroundColor: "white",
              boxShadow: "none",
              my: 2,
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                size="large"
                sx={{
                  visibility: "hidden",
                  backgroundColor: "#eceff4",
                  color: "#1788df",
                  ":hover": {
                    backgroundColor: "#1788df",
                    color: "white",
                  },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography
                variant="h5"
                sx={{ color: "black", fontWeight: "bold" }}
              >
                EDI Data and Validation
              </Typography>
              <IconButton
                size="large"
                sx={{
                  backgroundColor: "#eceff4",
                  color: "#1788df",
                  ":hover": {
                    backgroundColor: "#1788df",
                    color: "white",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box
            mt={12}
            sx={{
              backgroundColor: "#f3f9fe",
              borderRadius: "42px 42px 0 0",
              minHeight: "496px",
            }}
            p={4}
          >
            <Stack spacing={2} direction="row" alignItems="center">
              <Avatar
                sx={{ width: "30px", height: "30px" }}
                src={yellowIcon}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                CSV TO JSON/CSV
              </Typography>
            </Stack>

            {!isFileUploaded ? (
              <Box>
                <Box>
                  <Stack mt={3} direction="row" justifyContent="space-between">
                    <Typography
                      component="label"
                      sx={{
                        color: "#1788df",
                        fontWeight: "600",
                        fontSize: "15px",
                      }}
                    >
                      Choose your file CSV:
                    </Typography>
                    <Typography
                      component="label"
                      sx={{ color: "#333333", fontSize: "15px" }}
                    >
                      Limit 200MB per file - CSV
                    </Typography>
                  </Stack>
                  <Box my={2}>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="baseline"
                      sx={{
                        border: "1px dashed #bcbcbc",
                        borderRadius: "16px",
                        padding: "20px",
                        color: "#b0bae6",
                        backgroundImage:
                          "linear-gradient(180deg, #f9fafe 0%, #f1f6ff 100%)",
                        filter:
                          "drop-shadow(5.29px 7.281px 6px rgba(23,136,223,0.16))",
                        ":hover": {
                          ".MuiSvgIcon-root": {
                            color: "#1788df",
                          },
                          borderColor: "#1788df",
                        },
                      }}
                      component="label"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                      }}
                    >
                      <input
                        hidden
                        name="csv"
                        accept=".csv"
                        multiple={false}
                        type="file"
                      />

                      <Stack direction="column" alignItems="center">
                        <CloudUploadIcon sx={{ fontSize: "50px" }} />
                        <Typography>Drag and drop file here</Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        component="p"
                        mx={3}
                        sx={{ color: "#1788df" }}
                      >
                        OR
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: "capitalize", cursor: "default" }}
                      >
                        Browse Files
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box my={2}>
                <Box>
                  <Typography component="label" sx={{ color: "#333333" }}>
                    Please Upload a File
                  </Typography>
                </Box>
                <Stack mt={1}>
                  <Paper sx={{ borderRadius: "20px" }}>
                    <Stack
                      direction="row"
                      p={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" alignItems="center">
                        <IconButton
                          sx={{
                            backgroundColor: "#f0f8fe",
                            borderRadius: "14px",
                            ":hover": {
                              backgroundColor: "#eceff4",
                            },
                            mr: 3,
                          }}
                        >
                          <InsertDriveFileIcon
                            sx={{ color: "#1788df", fontSize: "35px" }}
                          />
                        </IconButton>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {file.name}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center">
                        <Typography sx={{ fontWeight: "bold" }}>
                          {(file.size / 1000).toFixed(2)}KB
                        </Typography>
                        <IconButton
                          onClick={() => {
                            deleteFile();
                          }}
                          sx={{
                            ml: 3,
                            borderRadius: "14px",
                            backgroundColor: "#eceff4",
                            ":hover": {
                              backgroundColor: "red",
                              color: "white",
                            },
                          }}
                          size="large"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                </Stack>
                {/*  Original CSV */}
                <Box sx={{ mt: 3 }}>
                  {isError && (
                    <Alert severity="error" sx={{ fontWeight: "600", mb: 2 }}>
                      {ERRORS[error].msg}
                    </Alert>
                  )}
                  <Stack direction="row">
                    <Typography
                      mb={2}
                      variant="h6"
                      sx={{
                        color: "#1788df",
                        fontSize: "18px",
                        fontWeight: "700",
                      }}
                    >
                      Original CSV
                    </Typography>
                  </Stack>

                  <Paper
                    sx={{
                      borderRadius: "20px",
                      padding: "10px",
                    }}
                  >
                    <TableContainer
                      sx={{
                        height: "500px",
                        "&::-webkit-scrollbar": {
                          width: "16px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#1788df",
                          border: "4px solid transparent",
                          borderRadius: "10px",
                          backgroundClip: "padding-box",
                          minHeight: "100px",
                        },
                      }}
                    >
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: "#f0f8fe" }}>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: "#1788df",
                                fontSize: "16px",
                                fontWeight: "700",
                                lineHeight: "26px",
                                padding: "8px",
                              }}
                            >
                              Sr.No
                            </TableCell>
                            {columns.map((column_name, column_index) => {
                              return (
                                <TableCell
                                  key={column_index}
                                  align="left"
                                  sx={{
                                    color: "#1788df",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    lineHeight: "26px",
                                    padding: "8px",
                                  }}
                                >
                                  {column_name}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData.map((row, row_index) => {
                            return (
                              <TableRow
                                key={row_index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  align="left"
                                  sx={{
                                    fontWeight: "600",
                                    lineHeight: "26px",
                                    padding: "8px",
                                    color: "#23242d",
                                  }}
                                >
                                  {row_index + 1}
                                </TableCell>

                                {Object.keys(row).map(
                                  (column_name, column_index) => {
                                    return (
                                      <TableCell
                                        align="left"
                                        sx={{
                                          color: "#23242d",
                                          fontWeight: "600",
                                          padding: "8px",
                                          whiteSpace: "nowrap",
                                          lineHeight: "26px",
                                          padding: "8px",
                                        }}
                                        key={column_index}
                                      >
                                        {row[column_name]}
                                      </TableCell>
                                    );
                                  }
                                )}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>

                {/*  New  CSV */}
                {noError && (
                  <Box sx={{ mt: 3 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="baseline"
                    >
                      <Typography
                        mb={2}
                        variant="h6"
                        sx={{
                          color: "#1788df",
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        New CSV
                      </Typography>
                      <Button
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: "capitalize" }}
                        onClick={downloadCSVFile}
                      >
                        Export CSV
                      </Button>
                    </Stack>

                    <Paper
                      sx={{
                        borderRadius: "20px",
                        padding: "10px",
                      }}
                    >
                      <TableContainer
                        sx={{
                          height: "500px",
                          "&::-webkit-scrollbar": {
                            width: "16px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#1788df",
                            border: "4px solid transparent",
                            borderRadius: "10px",
                            backgroundClip: "padding-box",
                            minHeight: "100px",
                          },
                        }}
                      >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead sx={{ backgroundColor: "#f0f8fe" }}>
                            <TableRow>
                              <TableCell
                                sx={{
                                  color: "#1788df",
                                  fontSize: "16px",
                                  fontWeight: "700",
                                  lineHeight: "26px",
                                  padding: "8px",
                                  whiteSpace: "normal",
                                }}
                              >
                                Sr.No
                              </TableCell>
                              {newColumns.map((column_name, column_index) => {
                                return (
                                  <TableCell
                                    key={column_index}
                                    sx={{
                                      color: "#1788df",
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      lineHeight: "26px",
                                      padding: "8px",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {column_name}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {newTableData.map((row, row_index) => {
                              return (
                                <TableRow
                                  key={row_index}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell
                                    // align="left"
                                    sx={{
                                      fontWeight: "600",
                                      lineHeight: "26px",
                                      padding: "8px",
                                      whiteSpace: isPaddProperty(formula[0])
                                        ? "pre"
                                        : "nowrap",
                                    }}
                                  >
                                    {row_index + 1}
                                  </TableCell>

                                  {Object.keys(row).map(
                                    (column_name, column_index) => {
                                      return (
                                        <TableCell
                                          // align="left"
                                          sx={{
                                            fontWeight: "600",
                                            padding: "8px",
                                            whiteSpace: isPaddProperty(
                                              formula[0]
                                            )
                                              ? "pre"
                                              : "nowrap",

                                            lineHeight: "26px",
                                          }}
                                          key={column_index}
                                        >
                                          {row[column_name]}
                                        </TableCell>
                                      );
                                    }
                                  )}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
