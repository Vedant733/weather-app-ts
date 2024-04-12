/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { COUNTRY_TABLE_URL, TABLE_DATA_LIMIT } from "../Constants";
import { Box, Typography } from "@mui/material";
import React, { type UIEvent } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_RowVirtualizer,
} from "material-react-table";
import { createSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InfoModal from "../components/InfoModal";
import { CustomError } from "../ExtraFunctions";

type Coordinates = {
  lat: number;
  lon: number;
};
type CountryData = {
  geoname_id: number;
  name: string;
  country_code: string;
  timezone: string;
  population: number;
  coordinates: Coordinates;
};

type CountryResponse = {
  total_count: number;
  results: CountryData[];
};

function CountriesTable() {
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const modal = localStorage.getItem("modal");
    if (!modal) setOpen(true);
  }, []);
  const navigate = useNavigate();
  const [search, setSearch] = React.useState<string | undefined>("");
  const [tableData, setTableData] = React.useState<CountryData[]>([]);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = React.useRef<MRT_RowVirtualizer>(null);
  const [orderBy, setOrderBy] = React.useState<MRT_SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] =
    React.useState<MRT_ColumnFiltersState>([]);

  const COLUMNS: MRT_ColumnDef<CountryData>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: (props) => {
          return (
            <Typography
              onClick={() => {
                const { lat, lon } = props.row.original.coordinates;
                if (!lat || !lon) return alert("Invalid coordinates.");
                navigate({
                  pathname: "/weather",
                  search: createSearchParams({
                    lat: lat.toString(),
                    lon: lon.toString(),
                  }).toString(),
                });
              }}
              onContextMenu={() => {
                const { lat, lon } = props.row.original.coordinates;
                if (!lat || !lon) return alert("Invalid coordinates.");
                const url = new URL(window.location.origin + "/weather");
                const params = new URLSearchParams({
                  lat: lat.toString(),
                  lon: lon.toString(),
                });
                url.search = params.toString();
                window.open(url, "_blank");
              }}
              sx={{ cursor: "pointer", padding: "1rem" }}
            >
              {props.renderedCellValue}
            </Typography>
          );
        },
        enableColumnFilter: false,
      },
      {
        accessorKey: "country_code",
        header: "Country Code",
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "coordinates",
        header: "Coordinates",
        Cell: (props) => {
          // Access the coordinates object from the row data
          const { lat, lon } = props.row.original.coordinates;
          // Return a custom component or string to display the coordinates
          return <div>{`${lat} , ${lon}`}</div>;
        },
        enableSorting: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "timezone",
        header: "Timezone",
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "population",
        header: "Population",
        enableColumnFilter: false,
        enableColumnActions: false,
      },
    ],
    []
  );

  const resetTableData = () => {
    setTableData([]);
    setPage(0);
  };

  const { data, isFetching, isError, refetch } = useQuery(
    ["COUNRTY_DATA", orderBy, search],
    () => {
      const url = new URL(COUNTRY_TABLE_URL);
      url.searchParams.set(
        "select",
        "geoname_id,name,coordinates,population,country_code,timezone"
      );
      url.searchParams.set("limit", TABLE_DATA_LIMIT + "");
      if (search && search.length > 0) {
        url.searchParams.set("where", `startswith(name,'${search}')`);
      }
      if (orderBy.length > 0)
        url.searchParams.set(
          "order_by",
          `${orderBy[0].id}${orderBy[0].desc ? " DESC" : ""}`
        );
      url.searchParams.set("offset", page * TABLE_DATA_LIMIT + "");
      return axios.get<CountryResponse>(url.href);
    },
    {
      onSuccess(data) {
        setTableData((prev) => [
          ...prev,
          ...(data?.data?.results as CountryData[]),
        ]);
      },
      onError(err: AxiosError<CustomError>) {
        toast.error(err.message, { toastId: "cTable" });
      },
    }
  );

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          (page + 1) * TABLE_DATA_LIMIT < (data?.data?.total_count ?? 0)
        ) {
          setPage((prev) => prev + 1);
          refetch();
        }
      }
    },
    [data]
  );

  const table = useMaterialReactTable({
    columns: COLUMNS,
    data: tableData,
    enablePagination: false,
    enableRowNumbers: true,
    manualFiltering: false,
    manualSorting: true,
    muiTableContainerProps: {
      ref: tableRef, //get access to the table container element
      sx: { height: "80vh", maxHeight: "800px", marginBottom: "24px" }, //give the table a max height
      onScroll: (event: UIEvent<HTMLDivElement>) =>
        fetchMoreOnBottomReached(event.target as HTMLDivElement), //add an event listener to the table container element
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: (params) => {
      resetTableData();
      setOrderBy(params);
    },
    state: {
      columnFilters,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting: orderBy,
    },
    rowVirtualizerInstanceRef, //get access to the virtualizer instance
    onGlobalFilterChange: (param) => {
      setSearch(param);
      resetTableData();
    },
  });

  return (
    <Box sx={{ overflow: "hidden" }}>
      <InfoModal open={open} setOpen={setOpen} />
      <MaterialReactTable table={table} />
    </Box>
  );
}

export default CountriesTable;
