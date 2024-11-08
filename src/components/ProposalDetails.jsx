import React, { useEffect, useState } from "react";
import Title from "./Title";
import Button from "./Button";
import { MdEdit, MdEmail, MdDelete, MdLocalPrintshop } from "react-icons/md";
import { useParams } from "react-router-dom";
import {
  useDeleteProposalMutation,
  useGetProposalByIdQuery,
  useHandlePrintPDFMutation,
} from "../redux/slices/api/proposalApiSlice";
import Loading from "./Loader";
import { formatDate } from "../helpers/formatDate.js";
import { toast } from "sonner";
import axios from "axios";

const ProposalDetails = () => {
  const { id } = useParams();

  const {
    data: proposalData,
    isLoading,
    refetch,
  } = useGetProposalByIdQuery(id);
  const [deleteProposal] = useDeleteProposalMutation();
  const [printProposal] = useHandlePrintPDFMutation();
  const [data, setData] = useState({});

  useEffect(() => {
    if (proposalData) {
      setData(proposalData.proposal);
    }
  }, [proposalData]);

  const handleDownload = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:8800/api/proposals/download",
        responseType: "blob",
        withCredentials: true,
      });

      // Create a blob URL for the blob
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "proposal.pdf";

      // Append anchor to the body, click it, and remove it immediately
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke the blob URL to free up resources
      window.URL.revokeObjectURL(blobUrl);

      console.log("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF");
    }
  };

  const handleProposalPrint = async (data) => {
    let res = await printProposal(data).unwrap();
    console.log(res);
    if (res.status) {
      // make download action
      handleDownload();
    } else {
      toast.warning("Something went wrong");
    }
  };

  const removeProposal = async (id) => {
    const res = await deleteProposal(id);
    if (res.data.status === true) {
      toast.success("Proposal Deleted Success");
      window.history.back();
    }
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="px-5">
        <div className="w-full md:px-1 px-0 mb-6">
          <div className="flex justify-between mb-4 mt-2">
            <Title title="Proposal Details" className={"px-5 font-bold"} />
            <Button
              label={"Back"}
              className={"bg-gray-700 text-white px-5 rounded-lg"}
              onClick={() => {
                window.history.back();
              }}
            />
          </div>
          {data && data.leadId && data.products && (
            <>
              <div className="bg-white px-2 md:px-4 py-7 shadow-md rounded">
                <div className="overflow-x-auto flex justify-between items-center border-solid border-b-2 border-black-300 pb-5">
                  <p className="px-5 font-bold">
                    Proposal ID : {data.proposalId}
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      label="Print"
                      onClick={() => {
                        handleProposalPrint(data);
                      }}
                      icon={<MdLocalPrintshop className="text-lg" />}
                      className="bg-blue-600 flex flex-row-reverse gap-1 items-center text-white rounded-md 2xl:py-2 text-sm"
                    />
                    <Button
                      label="Email"
                      icon={<MdEmail className="text-lg" />}
                      className="bg-green-600 flex flex-row-reverse gap-1 items-center text-white rounded-md 2xl:py-2 text-sm"
                    />
                    <Button
                      label="Remove"
                      icon={<MdDelete className="text-sm" />}
                      className="bg-red-600 flex flex-row-reverse gap-1 items-center text-white rounded-md 2xl:py-2 text-sm"
                      onClick={() => {
                        removeProposal(data._id);
                      }}
                    />
                  </div>
                </div>
                <div className="p-5 border-solid border-b-2 border-black-300 pb-5">
                  <div className="text-xl py-5">
                    Company Name :{" "}
                    <span className="font-bold">
                      {data.leadId.companyName.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-10">
                    <div>
                      <h2 className="font-bold text-2xl py-4 text-blue-700">
                        Company Details
                      </h2>
                      <p>
                        <span className="font-bold">Customer Name :</span>{" "}
                        {data.leadId.customerName}
                      </p>
                      <p>
                        <span className="font-bold">Date :</span>{" "}
                        {formatDate(data.leadId.createdAt)}
                      </p>
                      <p>
                        <span className="font-bold">Status :</span>{" "}
                        {data.status}
                      </p>
                      <p>
                        <span className="font-bold">Address :</span>{" "}
                        {data.leadId.address}
                      </p>
                      <p>
                        <span className="font-bold">Phone No :</span>{" "}
                        {data.leadId.phone}
                      </p>
                      <p>
                        <span className="font-bold">Email Id :</span>{" "}
                        {data.leadId.email}
                      </p>
                      <p>
                        <span className="font-bold">City :</span>{" "}
                        {data.leadId.city}
                      </p>
                      <p>
                        <span className="font-bold">State :</span>{" "}
                        {data.leadId.state}
                      </p>
                      <p>
                        <span className="font-bold">Country :</span>{" "}
                        {data.leadId.country}
                      </p>
                      <p>
                        <span className="font-bold">Created By :</span>{" "}
                        {formatDate(data.leadId.createdAt)}
                      </p>
                      <p>
                        <span className="font-bold">Updated By :</span>{" "}
                        {formatDate(data.leadId.updatedAt)}
                      </p>
                    </div>
                    <div>
                      <h2 className="font-bold text-2xl py-4 text-blue-700">
                        Proposal Details
                      </h2>
                      <p>
                        <span className="font-bold">Subject :</span>{" "}
                        {data.proposalSubject}
                      </p>
                      <p>
                        <span className="font-bold">Payment Term :</span>{" "}
                        {data.paymentTerm}
                      </p>
                      <p>
                        <span className="font-bold">Delivery Term :</span>{" "}
                        {data.deliveryTerm}
                      </p>
                      <p>
                        <span className="font-bold">Quotaion Validity :</span>{" "}
                        {data.validity}
                      </p>
                      <p>
                        <span className="font-bold">Remarks :</span>{" "}
                        {data.remarks}
                      </p>
                      <p>
                        <span className="font-bold">A/C Manager :</span>{" "}
                        {data.accountManager}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded mt-5">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-solid border-b-2 border-black-300 bg-red-300">
                      <tr className="text-black text-left text-lg">
                        <th className="py-2 px-5">Product</th>
                        <th className="py-2 px-5">Qty</th>
                        <th className="py-2 px-5">Rate</th>
                        <th className="py-2 px-5">Total</th>
                        <th className="py-2 px-5">GST Value</th>
                        <th className="py-2 px-5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.products.map((item, index) => (
                        <tr
                          className="text-black text-left font-light border-solid border-b-2 border-black-300"
                          key={index}
                        >
                          <td className="py-2 px-5">{item.productId.name}</td>
                          <td className="py-2 px-5">{item.quantity}</td>
                          <td className="py-2 px-5">{item.productId.price}</td>
                          <td className="py-2 px-5">
                            {item.productId.price * item.quantity}
                          </td>
                          <td className="py-2 px-5">{item.productId.gst}</td>
                          <td className="py-2 px-5 text-right">
                            {item.productId.price * item.quantity +
                              item.productId.gst}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="border-solid border-b-2 border-black-300 font-bold flex justify-between px-4 py-2 text-xl w-full">
                    <p>Total</p>
                    <p>{data.totalAmount}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProposalDetails;
