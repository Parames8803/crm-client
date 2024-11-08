import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import Title from "../components/Title";
import { IoMdAdd } from "react-icons/io";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import {
  useGetProposalsQuery,
  useToggleProposalStatusMutation,
} from "../redux/slices/api/proposalApiSlice";
import Loading from "../components/Loader";
import { formatDate } from "../helpers/formatDate.js";
import ConfirmatioDialog from "../components/Dialogs.jsx";
import { toast } from "sonner";

const Proposals = () => {
  const navigate = useNavigate();

  const { data: proposalData, isLoading, refetch } = useGetProposalsQuery();
  const [sendStatusSwitch] = useToggleProposalStatusMutation();
  const [proposals, setProposals] = useState();
  const [selected, setSelected] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const proposalStatusClick = (el) => {
    setSelected(el);
    setOpenDialog(true);
  };

  const handleProposalStatus = async () => {
    let res = await sendStatusSwitch({
      id: selected._id,
      status: selected.status,
    }).unwrap();
    if (res.status) {
      toast.success(res.message);
      setOpenDialog(false);
      refetch();
    } else {
      toast.warning("Something went wrong");
    }
  };

  useEffect(() => {
    if (proposalData) {
      setProposals(proposalData.proposals);
    }
  }, [proposalData]);

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-2">
      <div className="w-full md:px-1 px-0 my-2">
        <div className="flex items-center justify-between mb-8">
          <Title title="Proposals list" />
          <Button
            label="Add New Proposal"
            icon={<IoMdAdd className="text-lg" />}
            onClick={() => {
              navigate("/proposals/add_proposal");
            }}
            className="bg-cyan-600 text-white flex flex-row-reverse gap-1 items-center text-white 2xl:py-2.5"
          />
        </div>
        {proposals && proposals.length > 0 ? (
          <>
            <div className="bg-white shadow-md rounded">
              <div className="overflow-x-auto p-5 shadow-sm">
                <table className="w-full">
                  <thead className="bg-red-300 text-black">
                    <tr className="text-center">
                      <th className="py-3 text-left px-5">Proposal No</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Company</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Status</th>
                      <th className="py-3 text-right px-5">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map((value, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="text-left px-5">{value.proposalId}</td>
                        <td className="text-center py-3">
                          {formatDate(value.createdAt)}
                        </td>
                        <td className="text-center py-3">
                          {value.leadId.companyName}
                        </td>
                        <td className="text-center py-3">
                          {value.totalAmount}
                        </td>
                        <td className="text-center py-4">
                          <span
                            className={clsx(
                              "w-fit px-4 text-white py-1 rounded-full cursor-pointer",
                              value.status === "Gain"
                                ? "bg-green-600"
                                : "bg-blue-600"
                            )}
                            onClick={() => {
                              proposalStatusClick(value);
                            }}
                          >
                            {value.status}
                          </span>
                        </td>
                        <td className="text-right px-3">
                          <button
                            className="w-fit px-4 py-1 rounded-full bg-blue-200 text-gray-600"
                            onClick={() => {
                              navigate(`/proposals/${value._id}`);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-xl text-gray-700">No Proposals Found</div>
        )}
      </div>
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={handleProposalStatus}
        type="toggle"
        msg="Are you sure want to toggle the Status of Proposal"
      />
    </div>
  );
};

export default Proposals;
