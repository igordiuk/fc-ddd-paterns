import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import CustomerUpdateAddressEvent from "../../customer/event/customer-update-address.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log.handler";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";

describe("Customer events tests", () => {
  it("should register two event handlers", () => {
    const eventDispatcher = new EventDispatcher();

    const customerEventHandler1 = new EnviaConsoleLog1Handler();
    const customerEventHandler2 = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", customerEventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", customerEventHandler2);
    
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(customerEventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(customerEventHandler2);

    
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    
    const customerEventHandler1 = new EnviaConsoleLog1Handler();
    const customerEventHandler2 = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", customerEventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", customerEventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(customerEventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(customerEventHandler2);

    eventDispatcher.unregister("CustomerCreatedEvent", customerEventHandler1);
    eventDispatcher.unregister("CustomerCreatedEvent", customerEventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    
    const customerEventHandler1 = new EnviaConsoleLog1Handler();
    const customerEventHandler2 = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", customerEventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", customerEventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(customerEventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(customerEventHandler2);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify customer create event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const eventConsoleLog2Handler = new EnviaConsoleLog2Handler();

    const spyEventConsoleLogHandler = jest.spyOn(eventConsoleLog1Handler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", eventConsoleLog2Handler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventConsoleLog1Handler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "Customer 1",
      Address: {
        street: "Street 1",
        number: "1",
        zip: "80123-000",
        city: "Curitiba"
      }
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventConsoleLogHandler).toHaveBeenCalled();
  });

  
  it("should notify update customer address event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventConsoleLogHandler = new EnviaConsoleLogHandler();
    
    const spyEventConsoleLogHandler = jest.spyOn(eventConsoleLogHandler, "handle");

    eventDispatcher.register("CustomerUpdateAddressEvent", eventConsoleLogHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdateAddressEvent"][0]
    ).toMatchObject(eventConsoleLogHandler);

    
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;
    
    const newAddress = new Address("Street 7", 123, "01110-250", "São Paulo");
    customer.changeAddress(newAddress)

    const customerUpdateAddressEvent = new CustomerUpdateAddressEvent(customer);

    // Quando o notify for executado os seguintes handlers devem ser chamados:
    // EnviaConsoleLogHandler.handle()     
    eventDispatcher.notify(customerUpdateAddressEvent);

    expect(spyEventConsoleLogHandler).toHaveBeenCalled();
  });
});
