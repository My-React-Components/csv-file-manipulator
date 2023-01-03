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

function App() {
  const [file, setFile] = useState(null);
  const isFileUploaded = file ? true : false;
  const deleteFile = () => {
    setFile(null);
  };
  const [tableData, setTableData] = useState([]);
  const columns = tableData.length ? Object.keys(tableData[0]) : [];

  const csvFileReader = () => {
    if (isFileUploaded) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target.result;
        // console.log(text);
        var lines = text.split("\n");
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
          console.log("final list", list);
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
    property_value_invalid: {
      key: "property_value_invalid",
      msg: "You have entered invalid Property Value. Value between 1 and 10. ",
    },
  };
  const resetError = () => {
    setError(null);
  };

  const noError = formula.length === 4 && error === null;
  console.log("test", noError);

  return (
    <div>
      <Grid container spacing={2}>
        {/* first column 25% */}
        <Grid
          item
          xs={3}
          sx={{
            backgroundImage:
              'url("http://123.253.12.155:8088/rpac-app/img/sidebg.png")',
            height: "85vh",
            padding: "20px",
            borderBottomRightRadius: "50px",
            position: "fixed",
          }}
        >
          <Box sx={{ mt: 9, ml: 3, mb: 3 }}>
            <Typography
              variant="h5"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              User Controls
            </Typography>
          </Box>
          <Box sx={{ m: 3 }}>
            <Tooltip title="PROPERTY NAME, COLUMN NAME, NEW COLUMN NAME, PROPERTY VALUE">
              <TextField
                onBlur={(e) => {
                  var value = e.target.value.split(",");

                  //  our formula has 4 properties
                  if (value.length === 1 && value[0] !== "") {
                    resetError();
                  } else if (value.length === 4) {
                    if (value[0] !== "SPLIT") {
                      setError(ERRORS.property_invalid.key);
                    } else if (!columns.includes(value[1])) {
                      setError(ERRORS.column_invalid.key);
                    } else if (
                      parseInt(value[3]) < 1 ||
                      parseInt(value[3]) > 10
                    ) {
                      setError(ERRORS.property_value_invalid.key);
                    } else {
                      resetError();
                    }
                    setFormula(value);
                  } else {
                    //  it means formula is incorrect
                    resetError();
                  }
                }}
                size="small"
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "5px",
                  width: "200px",
                }}
                placeholder="ENTER FORMULA"
              />
            </Tooltip>
          </Box>
        </Grid>
        {/*  second column 75% */}
        <Grid item xs={8.7} sx={{ marginLeft: "25%" }}>
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
                src="http://123.253.12.155:8088/rpac-app/img/yellow-ico.svg"
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
                <Typography component="label" sx={{ color: "#333333" }}>
                  Please Upload a File
                </Typography>
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
                              }}
                            >
                              Sr.No
                            </TableCell>
                            {columns.map((column_name, column_index) => {
                              return (
                                <TableCell
                                  sx={{
                                    color: "#1788df",
                                    fontSize: "16px",
                                    fontWeight: "700",
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
                                  align="center"
                                  sx={{ fontWeight: "600" }}
                                >
                                  {row_index + 1}
                                </TableCell>

                                {Object.keys(row).map(
                                  (column_name, column_index) => {
                                    return (
                                      <TableCell
                                        align="center"
                                        sx={{
                                          fontWeight: "600",
                                          padding: "8px",
                                          whiteSpace: "nowrap",
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
                              }}
                            >
                              Sr.No
                            </TableCell>
                            {columns.map((column_name, column_index) => {
                              return (
                                <TableCell
                                  sx={{
                                    color: "#1788df",
                                    fontSize: "16px",
                                    fontWeight: "700",
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
                                  align="center"
                                  sx={{ fontWeight: "600" }}
                                >
                                  {row_index + 1}
                                </TableCell>

                                {Object.keys(row).map(
                                  (column_name, column_index) => {
                                    return (
                                      <TableCell
                                        align="center"
                                        sx={{
                                          fontWeight: "600",
                                          padding: "8px",
                                          whiteSpace: "nowrap",
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
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
