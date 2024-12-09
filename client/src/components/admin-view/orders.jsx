import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useState } from "react";

function AdminViewOrders() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
   // const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
    //const dispatch = useDispatch();


    return ( 
        <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            {/* <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow>
                      <TableCell>{orderItem?._id}</TableCell>
                      <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-3 ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-black"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>${orderItem?.totalAmount}</TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            View Details
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody> */}

<TableBody>
            <TableRow>
                <TableCell>123456</TableCell>
                <TableCell>123456</TableCell>
                <TableCell>123456</TableCell>
                <TableCell>123456</TableCell>
                <TableCell>
                    <Dialog  
                    open={openDetailsDialog}
                    onOpenChange={
                      setOpenDetailsDialog
                      //dispatch(resetOrderDetails());
                    }
                    >
                    <Button onClick={()=>setOpenDetailsDialog(true)}>
                        View Details
                    </Button>
                    <AdminOrderDetailsView/>
                    </Dialog>
        
                </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </CardContent>
      </Card>
     );
}

export default AdminViewOrders;